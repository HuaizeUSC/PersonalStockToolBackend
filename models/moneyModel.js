const mongoose = require("mongoose");
const moneySchema = new mongoose.Schema({ money: { type: Number, required: true } });
const money = mongoose.model("money", moneySchema, "money");

module.exports = money;
