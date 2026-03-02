import { Responder } from "@/application/utils";
import { getUserId } from "@/application/routers/auth/utils";
import { CartItem } from "@/persistance/models";
import { HttpStatus } from "@/constants";
import { type RequestHandler } from "express";

export const handleDeleteCartItem: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  try {
    const userId = getUserId(res);
    const deletedCount = await CartItem.destroy({
      where: { productId, userId },
    });

    if (deletedCount > 0) {
      Responder.noContent(res);
    } else {
      Responder.failure(res, HttpStatus.NOT_FOUND, "Item not found in cart");
    }
  } catch (err) {
    Responder.error(res, "Failed to remove item from cart", err);
  }
};
