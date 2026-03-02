import { expandDeliveryOption } from "@/application/routers/deliveryOptions/deliveryOptionsUtil";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { DeliveryOption } from "@/persistance/models";
import type { RequestHandler } from "express";

export const handleGetDeliveryOptions: RequestHandler = async (req, res) => {
  try {
    const { expand } = req.query;
    const deliveryOptions = await DeliveryOption.findAll();
    const successMessage = "Delivery options fetched successfully";

    if (expand == undefined) {
      return Responder.success(
        res,
        HttpStatus.OK,
        successMessage,
        deliveryOptions,
      );
    }

    const deliveryOptionsExpanded = deliveryOptions.map((deliveryOption) =>
      expandDeliveryOption(deliveryOption, expand),
    );

    Responder.success(
      res,
      HttpStatus.OK,
      successMessage,
      deliveryOptionsExpanded,
    );
  } catch (err) {
    Responder.error(res, "Failed to fetch delivery options", err);
  }
};
