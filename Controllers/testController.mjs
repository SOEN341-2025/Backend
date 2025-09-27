
import event from "../models/event.mjs"

function hello(req, res) {

    // cout
    console.log("hello")

    // return
    res.status(201).json({ message : "Product is added" })
}


const postTest = (req, res) => {
    console.log(req.body)
    res.status(201).json({ message : "post was called" })
}


const deleteTest = (req, res) => {
    console.log(req.body)
    res.status(201).json({ message : "delete was called" })
}

const updateTest = (req, res) => {
    const id = req.params.id


    res.status(201).json({ message : "update was called" })
}


const addEvent = (req, res) => {

    const body = req.body


    // Logic to add event
    const title = body.title
    const icon = body.icon
    const description = body.description
    const price = body.price
    const capacity = body.capacity
    const date = body.date
    const location = body.location
    const org_id = body.org_id

    event.addEvent(title, icon, description, price, capacity, date, location, org_id)


    res.status(201).json({ message : "Event added" })
}

const getEvents = (req, res) => {
    const events = event.getAllEvents()
    res.status(200).json(events)
}



export default { hello, postTest , deleteTest , updateTest , addEvent, getEvents }