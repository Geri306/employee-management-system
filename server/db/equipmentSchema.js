const mongoose = require("mongoose")

const equipmentSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    amount: Number,
  },
  { timestamps: true, collation: { locale: "en_US", strength: 1 } }
)

module.exports = mongoose.model("Equipment", equipmentSchema)
