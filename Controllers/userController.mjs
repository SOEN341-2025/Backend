

import User from '../models/user.mjs'
import { generateToken, getTokenInfo } from '../utils/jwt.mjs'

const login = async (req, res) => {

    console.log("meow")
    const { email, password } = req.body;

    try{
        const user = await User.checkUserPassword(email, password)

        // Generate JWT token
        const token = generateToken(user);
        const tokenInfo = getTokenInfo();

        res.status(200).json({ 
            message: "Login successful",
            token: token,
            tokenInfo: tokenInfo,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch{
        res.status(400).json({ error: "Invalid username or password" });
    }
}

export default { login }