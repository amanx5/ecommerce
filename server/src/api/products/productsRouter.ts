import { HttpStatus } from "@/constants";
import type { DefinedModelsMap } from "@/setup";
import { sendResponseError, isObject, isString, sendResponse } from "@/utils";
import express, { type Request, Response, NextFunction } from "express";
import Fuse from "fuse.js";
import { Op } from "sequelize";

export function getProductsRouter(modelsMap: DefinedModelsMap) {
  const { Product } = modelsMap;

  const productsRouter = express.Router();

  // Cache for search index only (id, name, keywords)
  let fuse: Fuse<unknown> | null = null;

  getAllProducts.examples = [
    "/api/products?search=apple",
    "/api/products?search=socks",
  ];
  productsRouter.get("/", getAllProducts);

  return productsRouter;

  async function getSearchIndex() {
    if (!fuse) {
      const lightweightProducts = await Product.findAll({
        attributes: ["id", "name", "keywords"],
      });
      const data = lightweightProducts.map((p) => p.dataValues);

      fuse = new Fuse(data, {
        keys: ["name", "keywords"],
        threshold: 0.4,
      });
    }
    return fuse;
  }

  async function getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { search } = req.query;

      let results: unknown[] = [];

      if (isString(search) && search.trim() !== "") {
        const fuseInstance = await getSearchIndex();
        const searchResults = fuseInstance.search(search);
        const matchedProductIds = searchResults
          .map((result) =>
            isObject(result.item) && isString(result.item.id)
              ? result.item.id
              : null,
          )
          .filter(isString);

        if (matchedProductIds.length === 0) {
          results = [];
        } else {
          const matchedProducts = await Product.findAll({
            where: {
              id: { [Op.in]: matchedProductIds },
            },
          });

          // Sort products back to match Fuse.js ranking order
          const idToIndexMap = new Map();
          matchedProductIds.forEach((id, index) => idToIndexMap.set(id, index));

          results = matchedProducts.sort((a, b) => {
            return (
              idToIndexMap.get(a.dataValues.id) -
              idToIndexMap.get(b.dataValues.id)
            );
          });
        }
      } else {
        results = await Product.findAll({
          order: [["createdAt", "DESC"]],
        });
      }

      sendResponse(
        res,
        HttpStatus.OK,
        true,
        "Products fetched successfully",
        results,
      );
    } catch (err) {
      sendResponseError(next, "Failed to fetch products", err);
    }
  }
}
