import { Responder } from "@/application/utils";
import { assertUserId } from "@/application/routers/auth/utils";
import { HttpStatus } from "@/constants";
import { CartItem } from "@/persistance/models";
import type { RequestHandler } from "express";
import { assertIsValidCreateCartItemPayload } from "@/application/routers/cartItems/utils/validators";
import { ClientError } from "@/application/errors";

/**
 * This handler adds a new item in the cart.
 * This rejects cart update requests.
 */
export const handlePostCartItem: RequestHandler = async (req, res) => {
  const payload = req.body;

  try {
    assertIsValidCreateCartItemPayload(payload);

    const userId = assertUserId(res);
    let cartItem = await CartItem.findOne({
      where: { productId: payload.productId, userId },
    });

    if (cartItem) {
      return Responder.failure(
        res,
        HttpStatus.BAD_REQUEST,
        "Item already present in cart.",
      );
    }

    const attributes = {
      ...payload,
      deliveryOptionId: payload.deliveryOptionId ?? "1",
      userId,
    };

    cartItem = await CartItem.create(attributes);

    Responder.success(res, HttpStatus.CREATED, "Item added to cart", cartItem);
  } catch (err) {
    if (err instanceof ClientError) {
      return Responder.failure(res, HttpStatus.BAD_REQUEST, err.message);
    }

    return Responder.error(res, "Failed to add item to cart. ", err);
  }
};
