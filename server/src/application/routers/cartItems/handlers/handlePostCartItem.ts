import { Responder } from "@/application/utils";
import { getUserId } from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { CartItem } from "@/persistance/models";
import type { RequestHandler } from "express";

const min = 1;
const max = 10;

export const handlePostCartItem: RequestHandler = async (req, res) => {
  const { productId, quantity = 1, deliveryOptionId = "1" } = req.body;

  if (!productId) {
    return Responder.failure(
      res,
      HttpStatus.BAD_REQUEST,
      "Product ID is required",
    );
  }

  const quantityIncrement = parseInt(quantity, 10);
  const isQuantityValid =
    !isNaN(quantityIncrement) &&
    quantityIncrement >= min &&
    quantityIncrement <= max;

  if (!isQuantityValid) {
    return Responder.failure(
      res,
      HttpStatus.BAD_REQUEST,
      `Quantity must be a number between ${min} and ${max}`,
    );
  }

  try {
    const userId = getUserId(res);
    let cartItem = await CartItem.findOne({
      where: { productId, userId },
    });

    if (cartItem) {
      const currentQuantity = cartItem.get("quantity");

      if (currentQuantity + quantityIncrement > max) {
        const available = max - currentQuantity;
        return Responder.failure(
          res,
          HttpStatus.BAD_REQUEST,
          available < 1
            ? "You have already added maximum quantity of this item to the cart"
            : `You can add maximum of ${available} more items`,
        );
      }
      await cartItem.increment("quantity", { by: quantityIncrement });
      await cartItem.reload();
    } else {
      cartItem = await CartItem.create({
        productId,
        quantity: quantityIncrement,
        deliveryOptionId,
        userId,
      });
    }

    Responder.success(res, HttpStatus.CREATED, "Item added to cart", cartItem);
  } catch (err) {
    Responder.error(res, "Failed to add item to cart", err);
  }
};
