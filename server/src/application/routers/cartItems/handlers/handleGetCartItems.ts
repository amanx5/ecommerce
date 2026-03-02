import { HttpStatus } from "@/constants";
import { CartItem } from "@/persistance/models";
import { Responder } from "@/application/utils";
import { type RequestHandler } from "express";
import { getUserId } from "@/application/routers/auth/utils";

export const handleGetCartItems: RequestHandler = async (req, res) => {
  try {
    const include = req.query.expand === "product" ? ["product"] : [];
    const userId = getUserId(res);

    const items = await CartItem.findAll({
      include,
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    Responder.success(
      res,
      HttpStatus.OK,
      "Cart items fetched successfully",
      items,
    );
  } catch (err) {
    Responder.error(res, "Failed to fetch cart items", err);
  }
};
