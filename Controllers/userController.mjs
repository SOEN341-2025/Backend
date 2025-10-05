

import User from '../models/user.mjs'

const login = async (req, res) => {

    console.log("meow")
    const { email, password } = req.body;

    try{
        const user = await User.checkUserPassword(email, password)

        res.status(200).json({ message: "Login successful" });
    }
    catch{
        res.status(400).json({ error: "Invalid username or password" });
    }
}

export default { login }