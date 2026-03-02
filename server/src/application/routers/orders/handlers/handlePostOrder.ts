import { getUserId } from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import {
  CartItem,
  DeliveryOption,
  Order,
  OrderItem,
  Product,
} from "@/persistance/models";
import { isObject } from "@/utils";
import { type RequestHandler } from "express";

export const handlePostOrder: RequestHandler = async (_req, res) => {
  const sequelize = Order.sequelize;
  if (!sequelize) {
    return Responder.error(
      res,
      "Failed to create order",
      "Sequelize instance is not available on Order model.",
    );
  }

  const t = await sequelize.transaction();

  try {
    const userId = getUserId(res);
    const cartItems = await CartItem.findAll({
      include: [
        { model: Product, as: "product" },
        { model: DeliveryOption, as: "deliveryOption" },
      ],
      where: { userId },
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();

      return Responder.failure(
        res,
        HttpStatus.BAD_REQUEST,
        "Can't create order. Cart is empty",
      );
    }

    let totalCostCents = 0;
    const orderItemsData = [];

    for (const cartItem of cartItems) {
      if (!isObject(cartItem.product) || !isObject(cartItem.deliveryOption)) {
        throw new Error("Association fields are missing in cart item");
      }

      const quantity = cartItem.quantity;
      const productId = cartItem.productId;
      const productPriceCents = cartItem.product.priceCents;
      const deliveryDays = cartItem.deliveryOption.deliveryDays;
      const deliveryPriceCents = cartItem.deliveryOption.priceCents;

      totalCostCents +=
        productPriceCents * quantity + deliveryPriceCents * quantity;

      const estimatedDeliveryTimeMs =
        Date.now() + deliveryDays * 24 * 60 * 60 * 1000;

      orderItemsData.push({
        productId,
        quantity,
        estimatedDeliveryTimeMs,
      });
    }

    const taxCents = Math.round(totalCostCents * 0.1);
    const totalCostCentsWithTax = totalCostCents + taxCents;

    const orderData = {
      orderTimeMs: Date.now(),
      totalCostCents: totalCostCentsWithTax,
      userId,
    };

    const order = await Order.create(orderData, { transaction: t });

    const orderItemsToCreate = orderItemsData.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await OrderItem.bulkCreate(orderItemsToCreate, { transaction: t });

    await CartItem.destroy({ where: { userId }, transaction: t });

    await t.commit();

    Responder.success(
      res,
      HttpStatus.CREATED,
      "Order created successfully",
      order,
    );
  } catch (err) {
    await t.rollback();
    Responder.error(res, "Failed to create order", err);
  }
};
