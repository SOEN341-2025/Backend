

import User from '../models/user.mjs'
import { generateToken, getTokenInfo } from '../utils/jwt.mjs'

const login = async (req, res) => {

    const { email, password } = req.body;

    try{
        const user = await User.checkUserPassword(email, password)

        // Generate JWT token
        const token = generateToken(user);
        const tokenInfo = getTokenInfo();

        res.status(200).json({ 
            id: user.id,
            email: user.email,
            token: token
        });
    }
    catch{
        res.status(400).json({ error: "Invalid username or password" });
    }
}

export default { login }