const mongoose = require("mongoose")

const connnectToDb = (url) => {
  const dbName = url.split("/").pop()

  mongoose.set("strictQuery", false).connect(url)

  const db = mongoose.connection

  // Events
  db.on("open", () => console.log("Connected to db:".cyan.underline, dbName))
  db.on("close", () =>
    console.log("Disconnected from db:".yellow.underline, dbName)
  )
  db.on("error", (error) =>
    console.error("There was an error:".red.underline, error)
  )
}

module.exports = connnectToDb
