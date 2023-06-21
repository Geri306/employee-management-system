const express = require("express")
const equipmentRoutes = express.Router()
const Equipment = require("../db/equipmentSchema.js")
const Employee = require("../db/employeeSchema.js")
const defaultEquipment = require("../populate/defaultEquipment.json")

// populate equipment table with default records
equipmentRoutes.get("/populate", async (req, res) => {
  await Equipment.deleteMany({})
  await Equipment.create(...defaultEquipment.data)
  res.status(200).end()
})

// send whole sorted list on root URL '/' and by sorting and filtering
equipmentRoutes.get("/records", (req, res) => {
  let { findCat, findVal, sortCol, sortDir, select } = req.query

  const queryValue = findCat === "amount" ? findVal : new RegExp(findVal, "i")

  const findQuery =
    findCat === "all" || findVal === "all" ? {} : { [findCat]: queryValue }

  const sortQuery = { [sortCol]: sortDir }

  const selectQuery = select === "all" && ""

  Equipment.find(findQuery)
    .collation({ locale: "en_US" })
    .sort(sortQuery)
    .select(selectQuery)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err.message)
      res.status(500).json(err)
    })
})

// show datasheet on 'edit'
equipmentRoutes.get("/record/:id", (req, res) => {
  Equipment.findOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err
    res.json(result)
  })
})

// create equipment on 'create equipment'
equipmentRoutes.post("/add", (req, res) => {
  Equipment.create(req.body, (err) => {
    if (err) {
      console.error(err)
      return res.status(400).json(err)
    }
    res.status(201).end()
  })
})

// update equipment on 'update record'
equipmentRoutes.put("/update/:id", (req, res) => {
  const { name, amount, type } = req.body
  const myQuery = { _id: req.params.id }
  const newValues = {
    $set: {
      name: name,
      amount: amount,
      type: type,
    },
  }

  Equipment.updateOne(myQuery, newValues, (err, result) => {
    if (err) throw err
    console.log("1 doc updated")
    res.json(result)
  })
})

// delete all records on 'delete all'
equipmentRoutes.delete("/deleteAll", (req, res) => {
  Equipment.deleteMany({}, (err, result) => {
    if (err) throw err
    res.status(204).end()
  })
})

// delete record on 'delete'
equipmentRoutes.delete("/delete/:id", (req, res) => {
  Equipment.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err
    console.log("1 doc deleted")
    res.status(204).end()
  })
})

// send inventory amounts
equipmentRoutes.get("/get/inventory", async (req, res) => {
  const inventory = await Equipment.find({})
    .sort({ name: 1 })
    .catch((err) => {
      console.error(err)
      res.status(500).json(err)
      return
    })

  res.status(200).json(inventory)
})

// update inventory
equipmentRoutes.post("/update/inventory", async (req, res) => {
  // console.log("REQ.BODY: ", req.body)
  /*const entries = Object.entries(req.body)
  console.log("ENTRIES: ", entries) */

  const filteredItems = req.body.filter((item) => item.amount !== 0)

  filteredItems.forEach((item) => {
    item.amount = parseInt(item.amount)
    delete item.name
  })

  console.log("FILTERED ITEMS: ", filteredItems)

  try {
    await Promise.all(
      filteredItems.map(async (entry) =>
        Equipment.updateOne(
          { _id: entry._id },
          { $inc: { amount: -entry.amount } }
        )
      )
    )

    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }

  res.end()
})

equipmentRoutes.put("/sync/inventory", async (req, res) => {
  try {
    const oldEmployee = await Employee.findById(req.body._id)
      .select("equipment")
      .populate("equipment._id")
      .catch((err) => console.log(err))

    const newEmployee = req.body

    const itemsInInventory = await Equipment.findById(
      req.body.equipment[0]._id
    ).catch((err) => console.log(err))

    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
})

module.exports = equipmentRoutes
