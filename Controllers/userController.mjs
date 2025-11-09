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
            organizations: user.organizations,
            token: token
        });
    }
    catch{
        res.status(400).json({ error: "Invalid username or password" });
    }

    
}

// NEW: register controller
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


export default { login, register }
