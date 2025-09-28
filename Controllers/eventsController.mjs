
import event from "../models/event.mjs"

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
    console.log(body)
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

const deleteEventById = (req, res) => {
    const id = parseInt(req.params.id)
    event.deleteEventById(id)
    res.status(200).json({ message: "Event deleted" })
}

const getEventById = (req, res) => {
    const id = parseInt(req.params.id)
    const event = event.getEventById(id)
    if (event) {
        res.status(200).json(event)
    } else {
        res.status(404).json({ message: "Event not found" })
    }
}

const getAllEvents = (req, res) => {
    const events = event.getAllEvents()
    if (events) {
        res.status(200).json(events)
    } else {
        res.status(404).json({ message: "No events found" })
    }
}

export default { postTest , deleteTest , updateTest , addEvent, getEventById, getAllEvents, deleteEventById }