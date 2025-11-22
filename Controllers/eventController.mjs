import Event from "../models/event.mjs"


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

    Event.addEvent(title, icon, description, price, capacity, date, location, org_id)

    res.status(201).json({ message : "Event added" })
}

const deleteEventById = (req, res) => {
    const id = parseInt(req.params.id)
    Event.deleteEventById(id)
    res.status(200).json({ message: "Event deleted" })
}

const getEventById = (req, res) => {
    const id = parseInt(req.params.id)
    const foundEvent = Event.getEventById(id)
    if (foundEvent) {
        res.status(200).json(foundEvent)
    } else {
        res.status(404).json({ message: "Event not found" })
    }
}

const getAllEvents = async (req, res) => {
    const events = await Event.getAllEvents()
    if (events) {
        res.status(200).json(events)
    } else {
        res.status(404).json({ message: "No events found" })
    }
}

const getEventAnalytics = async (req, res) => {
    const id = req.params.id
    let event = await Event.getEventById(id)
    const tickets = await Event.getEventTickets(id)
    event.tickets = tickets
    res.status(200).json(event)
}

export default { addEvent, getEventById, getAllEvents, deleteEventById, getEventAnalytics }