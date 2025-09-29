import express from "express"
import bodyparser from "body-parser"
import db from "./Helpers/db.mjs"
import user from "./models/user.mjs"
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


user.checkUserPassword("amir@amir", "1234").then(res => console.log(res)).catch(err => console.log(err));


app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})


