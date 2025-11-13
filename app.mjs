import express from "express"
import bodyparser from "body-parser"
import db from "./utils/db.mjs"
import User from "./models/user.mjs"
import Event from "./models/event.mjs"
import Role from "./models/role.mjs"
import Organization from "./models/organization.mjs"
import cors from "cors"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.mjs"
import eventRoutes from "./routes/eventRoutes.mjs"
import protectedRoutes from "./routes/protectedRoutes.mjs"

// Globals
////////////////////////////////////////////////////////////////////////////
const express_port = 3000


//Database
////////////////////////////////////////////////////////////////////////////
await db.createDB()

// Add Admin if there is none in db
const users = await User.getAllUsers()

if (users.length == 0)  {
  await User.createUser("admin", "admin@admin", "1234", true)
}

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
  const today = new Date().toISOString().split('T')[0];
  const ownerId = await User.createUser("owner_test", "owner@owner", "1234", false)
  const orgId = await Organization.createOrganization("test", "test.jpg", "this is a test org", ownerId)
  await Event.addEvent("Event 1", "event1.webp", "This is event 1", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 2", "event1.webp", "This is event 2", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 3", "event1.webp", "This is event 3", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 4", "event1.webp", "This is event 4", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 5", "event1.webp", "This is event 5", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 6", "event1.webp", "This is event 6", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 7", "event1.webp", "This is event 7", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 8", "event1.webp", "This is event 8", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 9", "event1.webp", "This is event 9", "1", "100", today, "Online", orgId)
  await Event.addEvent("Event 10", "event1.webp", "This is event 10", "1", "100", today, "Online", orgId)


  await Organization.createOrganization("Space Concordia", "spaceConcordia.webp", "this is Space Concordia", ownerId)
  await Organization.createOrganization("IEEE", "ieee_concordia_logo.jpeg", "this is IEEE", ownerId)
  await Organization.createOrganization("Formula Racing", "Formula.avif", "this is Formula", ownerId)


}
// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()


app.use(cors())
app.use(bodyparser.json())
app.use("/api/user", userRoutes)
app.use("/api/event", eventRoutes)
app.use("/api", protectedRoutes) // Todo 


app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})

// File saving
////////////////////////////////////////////////////////////////////////////
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Todo
// Saving files