const mongoose = require("mongoose")

const employeeSchmea = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    position: { type: String, required: true },
    level: { type: String, required: true },
    equipment: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: "Equipment",
        },
        amount: {
          type: Number,
        },
      },
    ],
    company: { type: String, required: false, unique: false, default: "" },
  },
  { timestamps: true, collation: { locale: "en_US", strength: 1 } }
)

module.exports = mongoose.model("Employee", employeeSchmea)
