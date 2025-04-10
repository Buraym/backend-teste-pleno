import { DataTypes, Deferrable } from "sequelize";
import { conn } from "../../config/db";
import Spot from "./Spot";

const Paycheck = conn.define(
  "Paycheck",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spot_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Spot,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    code: {
      type: DataTypes.CHAR,
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

export default Paycheck;
