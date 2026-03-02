import {
  defaultDeliveryOptions,
  defaultProducts,
  defaultUsers,
} from "@/persistance/defaults/";

import { DeliveryOption, Product, User } from "@/persistance/models/";

export async function seedDatabase() {
  const produtsCount = await Product.count();
  const deliveryOptionsCount = await DeliveryOption.count();
  const usersCount = await User.count();

  if (produtsCount === 0) {
    await Product.bulkCreate(defaultProducts);
  }

  if (deliveryOptionsCount === 0) {
    await DeliveryOption.bulkCreate(defaultDeliveryOptions);
  }

  if (usersCount === 0) {
    await User.bulkCreate(defaultUsers);
  }
}
