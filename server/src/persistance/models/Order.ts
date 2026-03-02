import type { User } from "@/persistance/models/";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  type ForeignKey,
  type Sequelize,
} from "sequelize";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<string>;
  declare orderTimeMs: number;
  declare totalCostCents: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // association
  declare userId: ForeignKey<User["id"]>;

  // initialization
  static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        orderTimeMs: { type: DataTypes.BIGINT, allowNull: false },
        totalCostCents: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      // options
      {
        sequelize,
        tableName: "orders",
        timestamps: true,
      },
    );
  }
}
