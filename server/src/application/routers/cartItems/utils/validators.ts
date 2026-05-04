import { throwClientError } from "@/application/errors";
import { findFirstNotIn, isNumber, isObject, isString } from "@/utils";

type AtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
  : never;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type CartItemPayload = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
};
type CartItemField = keyof CartItemPayload;

type CreateCartItemPayload = MakeOptional<CartItemPayload, "deliveryOptionId">;
type CreateCartItemField = keyof CreateCartItemPayload;

type UpdateCartItemPayload = AtLeastOne<Omit<CartItemPayload, "productId">>;
type UpdateCartItemField = keyof UpdateCartItemPayload;

const CREATE_CART_ITEM_REQUIRED_FIELDS = [
  "productId",
] as const satisfies CreateCartItemField[];

const CREATE_CART_ITEM_OPTIONAL_FIELDS = [
  "quantity",
  "deliveryOptionId",
] as const satisfies CreateCartItemField[];

const UPDATE_CART_ITEM_REQUIRED_FIELDS =
  [] as const satisfies UpdateCartItemField[];

const UPDATE_CART_ITEM_OPTIONAL_FIELDS = [
  "quantity",
  "deliveryOptionId",
] as const satisfies UpdateCartItemField[];

function validateCartItemPayload<F extends CartItemField>(
  payload: unknown,
  requiredFields: F[],
  optionalFields: F[],
): asserts payload is {
  [key in F]: CartItemPayload[key];
} {
  // throw if payload is not an object
  if (!isObject(payload)) throwClientError("Invalid request payload.");

  // throw if payload is empty
  const payloadFields = Object.keys(payload);
  if (payloadFields.length === 0) throwClientError("Payload cannot be empty");

  // throw if payload contains any Unexpected field
  const expectedFields = [...requiredFields, ...optionalFields];
  const unexpectedField = findFirstNotIn(payloadFields, expectedFields);
  if (unexpectedField) throwClientError(`Unexpected field: ${unexpectedField}`);

  // throw if any required field is missing
  const missingField = findFirstNotIn(requiredFields, payloadFields);
  if (missingField) throwClientError(`"${missingField}" is required.`);

  // validate individual fields if they are present
  const { quantity, deliveryOptionId } = payload;

  if (quantity !== undefined) {
    const { valid, error } = validateQuantity(quantity);
    if (!valid) throwClientError(error);
  }

  if (deliveryOptionId !== undefined) {
    const { valid, error } = validateDeliveryOptionId(deliveryOptionId);
    if (!valid) throwClientError(error);
  }
}

export function assertIsValidCreateCartItemPayload(
  payload: unknown,
): asserts payload is CreateCartItemPayload {
  validateCartItemPayload(
    payload,
    CREATE_CART_ITEM_REQUIRED_FIELDS,
    CREATE_CART_ITEM_OPTIONAL_FIELDS,
  );
}

export function assertIsValidUpdateCartItemPayload(
  payload: unknown,
): asserts payload is UpdateCartItemPayload {
  validateCartItemPayload(
    payload,
    UPDATE_CART_ITEM_REQUIRED_FIELDS,
    UPDATE_CART_ITEM_OPTIONAL_FIELDS,
  );
}

type ValidationResult =
  | { valid: true; error: null }
  | { valid: false; error: string };

function validateQuantity(quantity: unknown): ValidationResult {
  let error = null;
  const min = 1;
  const max = 10;
  const quantityInt = isNumber(quantity)
    ? quantity
    : isString(quantity)
      ? parseInt(quantity, 10)
      : NaN;

  if (isNaN(quantityInt)) {
    error = "Quantity must be a number.";
  } else if (quantityInt < min) {
    error = "Quantity must be minimum " + min;
  } else if (quantityInt > max) {
    error = `This item has a maximum quantity of ${max}`;
  }

  return error ? { valid: false, error } : { valid: true, error: null };
}

function validateDeliveryOptionId(deliveryOptionId: unknown): ValidationResult {
  let error = null;
  if (!isString(deliveryOptionId) || !deliveryOptionId.trim().length) {
    error = "Delivery option ID must be a non-empty string";
  } else {
    // leaving other validations upto the sequelize model
  }

  return error ? { valid: false, error } : { valid: true, error: null };
}
