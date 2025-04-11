import { DataTypes, Deferrable } from "sequelize";
import { conn } from "../../config/db";
import Paycheck from "./Paycheck";

const PaycheckIndex = conn.define(
  "PaycheckIndex",
  {
    paycheck_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Paycheck,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default PaycheckIndex;
