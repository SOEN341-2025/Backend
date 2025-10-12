import User from '../models/user.mjs'
import { generateToken } from '../utils/jwt.mjs'

const login = async (req, res) => {

    const { email, password } = req.body;

    try{
        const user = await User.checkUserPassword(email, password)

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({ 
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.is_admin,
            token: token
        });
    }
    catch{
        res.status(400).json({ error: "Invalid username or password" });
    }
}

// Todo
const logout = (req, res) => {

}

const signUp = async (req, res) => {
    const {name, email, password} = req.body
    const user = await User.createUser(name, email, password)
    const token = generateToken(user)
    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.is_admin,
        token: token
    })
}

const buyTicket = (req, res) => {
}

export default { login, signUp, logout, buyTicket }