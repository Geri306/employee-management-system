const express = require("express")
const recordRoutes = express.Router()
const Employee = require("../db/employeeSchema.js")
const defaultEmployees = require("../populate/defaultEmployees.json")

// populate employees table with default records
recordRoutes.get("/populate", async (req, res) => {
  await Employee.deleteMany({})
  await Employee.create(...defaultEmployees.data)
  res.status(200).end()
})

// send whole sorted list on root URL '/' and by sorting and filtering
recordRoutes.get("/records", (req, res) => {
  let { findCat, findVal, sortCol, sortDir, select } = req.query

  const queryValue = findCat === "age" ? findVal : new RegExp(findVal, "i")

  const findQuery =
    findCat === "all" || findVal === "all" ? {} : { [findCat]: queryValue }

  const sortQuery = { [sortCol]: sortDir }

  const selectQuery = select === "all" && ""

  Employee.find(findQuery)
    .populate("equipment._id")
    .sort(sortQuery)
    .select(selectQuery)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err.message)
      res.status(500).json(err)
    })
})

// show datasheet on 'edit'
recordRoutes.get("/record/:id", async (req, res) => {
  const result = await Employee.findOne({ _id: req.params.id })
    .populate("equipment._id")
    .catch((err) => console.error(err))

  res.status(200).json(result)
  return
})

// create employee on 'create employee'
recordRoutes.post("/add", (req, res) => {
  const filteredItems = req.body.equipment.filter((item) => item.amount !== 0)
  req.body.equipment = filteredItems

  req.body.age = parseInt(req.body.age)

  req.body.equipment.forEach((item) => {
    item.amount = parseInt(item.amount)
    delete item.name
  })

  /*
  const items = Object.entries(req.body.equipment)


  // return res.end()

  const equipment = []

  items.forEach((item) => {
    const newItem = {
      _id: item[0],
      amount: item[1],
    }

    equipment.push(newItem)
  })

  const newPerson = { ...req.body, equipment }
  // req.body.equipment = {...req.body, equipment}

 */
  // return res.end()

  Employee.create(req.body, (err) => {
    if (err) {
      console.error(err)
      return res.status(400).json(err)
    }
    res.status(201).end()
  })
})

// update employee on 'update record'
recordRoutes.put("/update/:id", (req, res) => {
  const { firstName, lastName, age, position, level, company } = req.body
  const myQuery = { _id: req.params.id }
  const newValues = {
    $set: {
      firstName: firstName,
      lastName: lastName,
      age: age,
      position: position,
      level: level,
      company: company,
    },
  }

  Employee.updateOne(myQuery, newValues, (err, result) => {
    if (err) throw err
    console.log("1 doc updated")
    res.json(result)
  })
})

// delete record on 'delete'
recordRoutes.delete("/delete", (req, res) => {
  Employee.deleteMany({}, (err, result) => {
    if (err) throw err
    res.status(204).end()
  })
})

// delete all records on 'delete all'
recordRoutes.delete("/delete/:id", (req, res) => {
  Employee.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err
    console.log("1 doc deleted")
    res.status(204).end()
  })
})

recordRoutes.get("/stats/count", async (req, res) => {
  try {
    const totalCount = await Employee.count({})
    const avgAge = await Employee.aggregate([
      {
        $group: {
          _id: "$position",
          avgAge: { $avg: "$age" },
        },
      },
    ]).sort({ _id: 1 })

    const levelCount = await Employee.count(req.query)
    res
      .status(200)
      .json({ totalCount: totalCount, levelCount: levelCount, avgAge: avgAge })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
})

/* recordRoutes.post('/update/equipment', (req, res) => {

}) */

module.exports = recordRoutes
