import { Responder } from "@/application/utils";
import { getUserId } from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { CartItem } from "@/persistance/models";
import { type RequestHandler } from "express";

export const handlePutCartItem: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const { deliveryOptionId } = req.body;

  try {
    const userId = getUserId(res);
    const cartItem = await CartItem.findOne({
      where: { productId, userId },
    });

    if (cartItem) {
      if (deliveryOptionId !== undefined) {
        await cartItem.update({ deliveryOptionId });
      }
      Responder.success(
        res,
        HttpStatus.OK,
        "Cart item updated successfully",
        cartItem,
      );
    } else {
      Responder.failure(res, HttpStatus.NOT_FOUND, "Item not found in cart");
    }
  } catch (err) {
    Responder.error(res, "Failed to update cart item", err);
  }
};
