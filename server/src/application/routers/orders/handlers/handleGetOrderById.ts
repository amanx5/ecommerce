import { getUserId } from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { Order, OrderItem, Product } from "@/persistance/models";
import type { RequestHandler } from "express";

export const handleGetOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;
    const userId = getUserId(res);
    const expand = req.query.expand;
    const include = [
      {
        model: OrderItem,
        as: "orderItems",
        include:
          expand === "products"
            ? [
                {
                  model: Product,
                  as: "product",
                },
              ]
            : [],
      },
    ];
    const where = {
      id: orderId,
      userId,
    };

    const order = await Order.findOne({ where, include });

    if (!order) {
      return Responder.failure(res, HttpStatus.NOT_FOUND, "Order not found");
    }

    Responder.success(res, HttpStatus.OK, "Order fetched successfully", order);
  } catch (error) {
    Responder.error(res, "Failed to fetch order", error);
  }
};
