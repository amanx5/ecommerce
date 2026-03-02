import { Responder } from "@/application/utils";
import { getUserId } from "@/application/routers/auth/utils/user";
import { HttpStatus } from "@/constants";
import { CartItem, Product, DeliveryOption } from "@/persistance/models/";
import { type RequestHandler } from "express";

export const handleGetPaymentSummary: RequestHandler = async (_req, res) => {
  try {
    const where = { userId: getUserId(res) };
    const cartItems = await CartItem.findAll({
      include: [
        { model: Product, as: "product" },
        { model: DeliveryOption, as: "deliveryOption" },
      ],
      where,
    });

    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const cartItem of cartItems) {
      if (!cartItem.product || !cartItem.deliveryOption) {
        throw new Error("Association fields are missing in cart item");
      }

      const quantity = cartItem.quantity;
      const productPriceCents = cartItem.product.priceCents;
      const deliveryPriceCents = cartItem.deliveryOption.priceCents;

      totalItems += quantity;
      productCostCents += productPriceCents * quantity;
      shippingCostCents += deliveryPriceCents * quantity;
    }

    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;

    const summary = {
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents,
    };

    return Responder.success(
      res,
      HttpStatus.OK,
      "Payment summary fetched successfully",
      summary,
    );
  } catch (err) {
    return Responder.error(res, "Failed to fetch payment summary", err);
  }
};
