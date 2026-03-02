import type { DeliveryOption, Product, User } from "@/persistance/models/";
import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  type Sequelize,
} from "sequelize";

export class CartItem extends Model<
  InferAttributes<CartItem, { omit: "product" | "deliveryOption" }>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<string>;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // foreign keys
  declare productId: ForeignKey<Product["id"]>;
  declare deliveryOptionId: ForeignKey<DeliveryOption["id"]> | null;
  declare userId: ForeignKey<User["id"]>;

  // Association properties (aka Non-persistent properties, transient, Eager-loaded relations)
  declare product?: NonAttribute<Product>;
  declare deliveryOption?: NonAttribute<DeliveryOption>;

  declare static associations: {
    product: Association<CartItem, Product>;
    deliveryOption: Association<CartItem, DeliveryOption>;
  };

  static initModel(sequelize: Sequelize) {
    this.init(
      // attributes
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "products", key: "id" },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: { min: 1, max: 10 },
        },
        deliveryOptionId: {
          type: DataTypes.STRING,
          references: { model: "delivery_options", key: "id" },
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      // options
      {
        sequelize,
        tableName: "cart_items",
        timestamps: true,
      },
    );
  }
}
