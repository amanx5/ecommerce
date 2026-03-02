import { getUserId } from "@/application/routers/auth/utils";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { Order, OrderItem, Product } from "@/persistance/models";
import type { RequestHandler } from "express";

export const handleGetOrders: RequestHandler = async (req, res) => {
  try {
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
      userId: getUserId(res),
    };

    const orders = await Order.findAll({
      include,
      order: [["createdAt", "DESC"]],
      where,
    });

    Responder.success(
      res,
      HttpStatus.OK,
      "Orders fetched successfully",
      orders,
    );
  } catch (error) {
    Responder.error(res, "Failed to fetch orders", error);
  }
};
