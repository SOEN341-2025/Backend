
const events = [{id : 1, name: "Sample Event", date: "2023-10-01"}];


// BIG TODO

const addEvent = (title, icon, description, price, capacity, date, location, org_id) => {
    events.push({ id: events.length + 1, title, icon, description, price, capacity, date, location, org_id });
}

const deleteEventById = (id) => {
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
        events.splice(index, 1);
    }
}

const getEventById = (id) => {
    return events.find(event => event.id === id);
}


const getAllEvents = () => {
    return events;
}

export default { addEvent, getEventById, getAllEvents, deleteEventById };