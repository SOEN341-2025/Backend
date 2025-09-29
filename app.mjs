import express from "express"
import bodyparser from "body-parser"
import db from "./Helpers/db.mjs"
import testRoutes from "./routes/testRoutes.mjs"

// Globals
////////////////////////////////////////////////////////////////////////////
const express_port = 3000


//Database
////////////////////////////////////////////////////////////////////////////
db.createDB()

// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()

app.use(bodyparser.json())
app.use("/api/test", testRoutes)

app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})


