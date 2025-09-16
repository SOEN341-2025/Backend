import express from "express"
import bodyparser from "body-parser"


// Globals
////////////////////////////////////////////////////////////////////////////
const express_port = 3000


// express setup
////////////////////////////////////////////////////////////////////////////
const app = express()

app.use(bodyparser.json())

app.listen(express_port,'0.0.0.0', () => {
  console.log(`Web API listening on port ${express_port}`)
})


