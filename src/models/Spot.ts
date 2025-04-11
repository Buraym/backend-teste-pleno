import { DataTypes } from "sequelize";
import { conn } from "../../config/db";

const Spot = conn.define(
  "Spot",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Spot;
