
import User from "../models/user.mjs"
import Organization from "../models/organization.mjs"

const deleteUser = async (req, res) => {

    const id = req.body.id

    try {
        
        const user = await User.getUser(id)
        if (user.is_admin)
            return res.status(400).json({message : "Unable to remove admin"})

        await User.deleteUser(id)
    }
    catch{
        return res.status(400).json({message : "bad request"})
    }
    res.status(204).json({message : "user deleted"})

}


const updateUser = async (req, res) => {

    const id = req.body.id
    const user = await User.getUser(id)


}

const deleteOrganization = (req, res) => {

}


const verifyOrganization = (req, res) => {

}

const deleteEvent = (req, res) => {

}


export default {deleteEvent, verifyOrganization, deleteOrganization, deleteUser, updateUser}