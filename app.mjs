import express from "express"
import bodyparser from "body-parser"
import db from "./utils/db.mjs"
import cors from "cors"
import fillDB from "./utils/fillDb.mjs"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.mjs"
import ticketRoutes from "./routes/ticketRoutes.mjs"
import organizationRoutes from "./routes/organizationRoutes.mjs";
import eventRoutes from "./routes/eventRoutes.mjs"
import adminRoutes from "./routes/adminRoutes.mjs"

// Globals
////////////////////////////////////////////////////////////////////////////
const express_port = 3000


//Database
////////////////////////////////////////////////////////////////////////////
await db.createDB()
await fillDB()

// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()


app.use(cors())
app.use(bodyparser.json())
app.use("/api/user", userRoutes)
app.use("/api/organization", organizationRoutes)
app.use("/api/ticket", ticketRoutes)
app.use("/api/event", eventRoutes)
app.use("/api/test", adminRoutes)


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