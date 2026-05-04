import { Responder } from "@/application/utils";
import { getUserId } from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { CartItem } from "@/persistance/models";
import { type RequestHandler } from "express";
import { assertIsValidUpdateCartItemPayload } from "@/application/routers/cartItems/utils/validators";
import { ClientError } from "@/application/errors";

export const handlePutCartItem: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const payload = req.body;

  try {
    assertIsValidUpdateCartItemPayload(payload);
    const userId = getUserId(res);
    const cartItem = await CartItem.findOne({
      where: { productId, userId },
    });

    if (!cartItem) {
      return Responder.failure(
        res,
        HttpStatus.NOT_FOUND,
        "Item not found in cart",
      );
    }

    await cartItem.update(payload);

    return Responder.success(
      res,
      HttpStatus.OK,
      "Cart item updated successfully",
      cartItem,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      return Responder.failure(res, HttpStatus.BAD_REQUEST, err.message);
    }

    return Responder.error(res, "Failed to update cart item", err);
  }
};
