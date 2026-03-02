import { ClientError, MalformedRequestUrlError } from "@/application/errors";
import { expandDeliveryOption } from "@/application/routers/deliveryOptions/deliveryOptionsUtil";
import { Responder } from "@/application/utils";
import { HttpStatus } from "@/constants";
import { DeliveryOption } from "@/persistance/models";
import { isArray } from "@/utils";
import type { RequestHandler } from "express";

export const handleGetDeliveryOptionById: RequestHandler = async (req, res) => {
  try {
    const { expand } = req.query;
    const deliveryOptionId = req.params.id;
    const successMessage = "Delivery option fetched successfully";
    if (isArray(deliveryOptionId)) {
      throw new MalformedRequestUrlError();
    }

    const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);

    if (deliveryOption == null) {
      return Responder.failure(
        res,
        HttpStatus.NOT_FOUND,
        "Delivery option doesn't exist with given id",
      );
    }

    if (expand == undefined) {
      return Responder.success(
        res,
        HttpStatus.OK,
        successMessage,
        deliveryOption,
      );
    }

    const deliveryOptionExpanded = expandDeliveryOption(deliveryOption, expand);

    Responder.success(
      res,
      HttpStatus.OK,
      successMessage,
      deliveryOptionExpanded,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      return Responder.failure(res, HttpStatus.BAD_REQUEST, err.message);
    }

    Responder.error(res, "Failed to fetch delivery option", err);
  }
};
