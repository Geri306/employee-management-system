const express = require("express")
const companyRoutes = express.Router()
const Company = require("../db/companySchema.js")

companyRoutes.get("/sendOptions", async (req, res) => {
  const result = await Company.find({}).catch((err) => console.error(err))
  res.status(200).json(result)
})

companyRoutes.post("/create", async (req, res) => {
  try {
    await Company.create(req.body)
  } catch (e) {
    res.status(500).json(e.message)
    return
  }
  const allCompany = await Company.find({}).catch((e) => console.error(e))
  res.status(201).json(allCompany)
})

module.exports = companyRoutes
