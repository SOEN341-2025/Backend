import User from "../models/user.mjs"

const getTickets = async (req, res) => {

  const user = req.user
  const tickets = await User.getUserTickets(user.id)

  res.status(200).json(tickets)
}

const buyTicket = async (req, res) => {

  const user = req.user
  const { eventId } = req.body;

  try{
    await User.addTicket(user.id, eventId )

    return res.status(200).json({ message : "ticket was bought" })
  }
  catch (err) {
    //Todo
    console.log(err)
  }

  res.status(500).json({ error: 'Server error' });
}


export default { getTickets, buyTicket }