import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { CartItem, Product } from "@/persistance/models";
import { isObject, isString } from "@/utils";
import { getUserId } from "@/application/routers/auth/utils";
import type { RequestHandler } from "express";
import Fuse from "fuse.js";
import { Op } from "sequelize";

let fuse: Fuse<unknown> | null = null;

export const handleGetProducts: RequestHandler = async (req, res) => {
  try {
    const { search } = req.query;

    let results: Product[] = [];

    // get cart product ids for current user
    let cartProductIds = new Set<string>();
    const userId = getUserId(res);

    if (userId) {
      const cartItems = await CartItem.findAll({
        where: { userId },
        attributes: ["productId"],
      });
      cartProductIds = new Set(cartItems.map((item) => item.productId));
    }

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

    // If user has items in cart, sort them to the end
    if (cartProductIds.size > 0) {
      results.sort((a, b) => {
        const aInCart = cartProductIds.has(a.id);
        const bInCart = cartProductIds.has(b.id);

        if (aInCart && !bInCart) return 1;
        if (!aInCart && bInCart) return -1;
        return 0; // Maintain relative order (search relevance or createdAt)
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
