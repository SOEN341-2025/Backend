import event from "../models/event.mjs"


const addEvent = (req, res) => {
    const body = req.body
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
    const foundEvent = event.getEventById(id)
    if (foundEvent) {
        res.status(200).json(foundEvent)
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

export default { addEvent, getEventById, getAllEvents, deleteEventById }