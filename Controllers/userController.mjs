import organization from '../models/organization.mjs';
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

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  try {
    const userId = await User.createUser(name, email, password, false);
    return res.status(201).json({ message: 'User created', id: userId });
  } catch (err) {
    console.error('Register error:', err);
    // SQLite unique constraint on email typically surfaces as SQLITE_CONSTRAINT
    if (err && (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE')))) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

const addWishList = async (req, res) => {
  const user = req.user
  const id = req.body.id

  await User.addWishListedEvents(user.id, id)


  res.status(200).json( {message : "event was wish listed"} )
}

const getWishList = async (req, res) => {

  const user = req.user
  const id = req.body.id

  const wishLists = await User.getWishListedEvents(user.id, id)

  res.status(200).json( wishLists )

}

export default { login, register , addWishList , getWishList }
