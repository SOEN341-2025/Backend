import express from "express"
import bodyparser from "body-parser"
import db from "./Helpers/db.mjs"
import User from "./models/user.mjs"
import Role from "./models/role.mjs"
import cors from "cors"
import userRoutes from "./routes/userRoutes.mjs"

// Globals
////////////////////////////////////////////////////////////////////////////
const express_port = 3000


//Database
////////////////////////////////////////////////////////////////////////////
await db.createDB()

// Add Admin if there is none in db
const users = await User.getAllUsers()
if (users.length == 0)  
  await User.createUser("admin", "admin@admin", "1234", true)

// add Roles to table if it is empty
const roles = await Role.getAllRoles()
if(roles.length == 0) {
  const roles = ["owner", "staff"]

  roles.forEach( async (r) => {
    await Role.addRole(r)
  })
}

// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()


app.use(cors())
app.use(bodyparser.json())
app.use("/api/user", userRoutes)


app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})


