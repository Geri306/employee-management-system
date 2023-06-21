const mongoose = require("mongoose")
const { Schema } = mongoose

const companySchema = new Schema(
  {
    name: { type: String, unique: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Company", companySchema)
