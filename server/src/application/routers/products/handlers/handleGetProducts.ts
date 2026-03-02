import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { Product } from "@/persistance/models";
import { isObject, isString } from "@/utils";
import type { RequestHandler } from "express";
import Fuse from "fuse.js";
import { Op } from "sequelize";

let fuse: Fuse<unknown> | null = null;

export const handleGetProducts: RequestHandler = async (req, res) => {
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

    Responder.success(
      res,
      HttpStatus.OK,
      "Products fetched successfully",
      results,
    );
  } catch (err) {
    Responder.error(res, "Failed to fetch products", err);
  }
};

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
