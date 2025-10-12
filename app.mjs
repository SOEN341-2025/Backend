import express from "express"
import bodyparser from "body-parser"
import db from "./utils/db.mjs"
import User from "./models/user.mjs"
import Role from "./models/role.mjs"
import Organization from "./models/organization.mjs"
import cors from "cors"
import userRoutes from "./routes/userRoutes.mjs"
import protectedRoutes from "./routes/protectedRoutes.mjs"

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


const orgs = await Organization.getAllOrganizations()
if(orgs.length == 0) {
  const ownerId = await User.createUser("owner_test", "owner@owner", "1234", false)
  await Organization.createOrganization("test", "test.png", "this is a test org", ownerId)
}
// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()


app.use(cors())
app.use(bodyparser.json())
app.use("/api/user", userRoutes)
app.use("/api", protectedRoutes)


app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})


