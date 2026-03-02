import {
  CartItem,
  DeliveryOption,
  Order,
  OrderItem,
  Product,
  User,
} from "@/persistance/models/";
import { type Sequelize } from "sequelize";

export function initAllModels(sequelize: Sequelize) {
  // initializations
  DeliveryOption.initModel(sequelize);
  Product.initModel(sequelize);
  Order.initModel(sequelize);
  CartItem.initModel(sequelize);
  OrderItem.initModel(sequelize);
  User.initModel(sequelize);

  // associations
  DeliveryOption.hasMany(CartItem, { foreignKey: "deliveryOptionId" });

  Product.hasMany(CartItem, { foreignKey: "productId" });
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });

  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });

  CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
  CartItem.belongsTo(DeliveryOption, {
    foreignKey: "deliveryOptionId",
    as: "deliveryOption",
  });
  CartItem.belongsTo(User, { foreignKey: "userId", as: "user" });

  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  User.hasMany(CartItem, { foreignKey: "userId" });
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
}
