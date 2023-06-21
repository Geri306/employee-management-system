const mongoose = require("mongoose")
const defaultEmployees = require("./defaultEmployees.json")
const defaultEquipment = require("./defaultEquipment.json")
const defaultCompanies = require("./defaultCompanies.json")
const Employee = require("../db/employeeSchema.js")
const Equipment = require("../db/equipmentSchema.js")
const Company = require("../db/companySchema.js")
require("dotenv").config({ path: "./config.env" })

async function populate() {
  try {
    mongoose.set("strictQuery", false).connect(process.env.MONGO_URL)

    mongoose.connection.dropCollection("employees")
    mongoose.connection.dropCollection("equipment")
    mongoose.connection.dropCollection("companies")

    await Employee.deleteMany({})
    await Equipment.deleteMany({})
    await Company.deleteMany({})

    await Employee.create(...defaultEmployees.data)
    await Equipment.create(...defaultEquipment.data)
    await Company.create(...defaultCompanies.data)

    await mongoose.disconnect()

    console.log("populated")
  } catch (err) {
    console.error(err)
  }
}

populate()
