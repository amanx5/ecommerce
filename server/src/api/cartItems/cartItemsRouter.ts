import { HttpStatus } from "@/constants";
import type { DefinedModelsMap } from "@/setup";
import { sendResponse, sendResponseError, isNumber } from "@/utils";
import express, { Request, Response, type NextFunction } from "express";

export function getCartItemsRouter(modelsMap: DefinedModelsMap) {
  const { CartItem } = modelsMap;
  const cartItemsRouter = express.Router();

  getCartItems.examples = ["/api/cartItems?expand=product"];
  cartItemsRouter.get("/", getCartItems);
  cartItemsRouter.post("/", addCartItem);
  updateCartItem.examples = ["/api/cartItems/123"];
  cartItemsRouter.put("/:productId", updateCartItem);
  removeCartItem.examples = ["/api/cartItems/123"];
  cartItemsRouter.delete("/:productId", removeCartItem);

  return cartItemsRouter;

  async function getCartItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { expand } = req.query;
      const include = [];

      if (expand === "product") {
        include.push("product");
      }

      const items = await CartItem.findAll({
        include,
        order: [["createdAt", "DESC"]],
      });

      sendResponse(
        res,
        HttpStatus.OK,
        true,
        "Cart items fetched successfully",
        items,
      );
    } catch (err) {
      sendResponseError(next, "Failed to fetch cart items", err);
    }
  }

  async function addCartItem(req: Request, res: Response, next: NextFunction) {
    const min = 0;
    const max = 10;

    const { productId, quantity = 1, deliveryOptionId = "1" } = req.body;

    if (!productId) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "Product ID is required",
      );
    }

    const quantityIncrement = parseInt(quantity, 10);
    const isQuantityValid =
      !isNaN(quantityIncrement) &&
      quantityIncrement >= min &&
      quantityIncrement <= max;

    if (!isQuantityValid) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "Quantity must be a number between 1 and 10",
      );
    }

    try {
      let cartItem = await CartItem.findOne({ where: { productId } });

      if (cartItem) {
        const currentQuantity = cartItem.get("quantity");
        if (
          isNumber(currentQuantity) &&
          currentQuantity + quantityIncrement > max
        ) {
          const available = max - currentQuantity;
          return sendResponse(
            res,
            HttpStatus.BAD_REQUEST,
            false,
            available < 1
              ? "You have already added maximum quantity of this item to the cart"
              : `You can add maximum of ${available} more items`,
          );
        }
        // Increment quantity atomically
        await cartItem.increment("quantity", { by: quantityIncrement });
        // Reload to get updated quantity for response
        await cartItem.reload();
      } else {
        // Create new item
        cartItem = await CartItem.create({
          productId,
          quantity: quantityIncrement,
          deliveryOptionId,
        });
      }

      sendResponse(
        res,
        HttpStatus.CREATED,
        true,
        "Item added to cart",
        cartItem,
      );
    } catch (err) {
      sendResponseError(next, "Failed to add item to cart", err);
    }
  }

  async function updateCartItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { productId } = req.params;
    const { deliveryOptionId } = req.body;

    try {
      const cartItem = await CartItem.findOne({ where: { productId } });

      if (cartItem) {
        if (deliveryOptionId !== undefined) {
          await cartItem.update({ deliveryOptionId });
        }
        sendResponse(
          res,
          HttpStatus.OK,
          true,
          "Cart item updated successfully",
          cartItem,
        );
      } else {
        sendResponse(
          res,
          HttpStatus.NOT_FOUND,
          false,
          "Item not found in cart",
        );
      }
    } catch (err) {
      sendResponseError(next, "Failed to update cart item", err);
    }
  }

  async function removeCartItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { productId } = req.params;

    try {
      const deletedCount = await CartItem.destroy({ where: { productId } });

      if (deletedCount > 0) {
        sendResponse(res, 204, true, "Item removed from cart");
      } else {
        sendResponse(res, 404, false, "Item not found in cart");
      }
    } catch (err) {
      sendResponseError(next, "Failed to remove item from cart", err);
    }
  }
}
