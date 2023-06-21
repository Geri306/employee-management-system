const express = require("express")
const app = express()
const connnectToDb = require("./db/db.js")
require("dotenv").config({ path: "./config.env" })
require("colors")

const port = process.env.PORT || 5000
const url = process.env.MONGO_URL

app.use(express.json())
app.use("/employees", require("./routes/record"))
app.use("/equipment", require("./routes/equipment"))
app.use("/company", require("./routes/company"))

app.listen(port, () => {
  connnectToDb(url)
  console.log("Server is running on port:".cyan.underline, port)
})
