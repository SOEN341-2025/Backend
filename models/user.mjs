import db from "../Helpers/db.mjs"
import bcrypt from "bcrypt";


const createUser = (name, email, password, isAdmin = false) => {

    const database = db.getDB()

    // Hashing the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        
        database.run(
            `INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)`,
            [name, email, hash, isAdmin],
            function (err) {
                if (err) {
                    console.error("Error inserting user:", err.message);
                } else {
                    console.log("User created with ID:", this.lastID);
                }
            }
        );
    });
}


const getUser = (id) => {
  const database = db.getDB();

  return new Promise((resolve, reject) => {
    database.get(
      `SELECT id, name, email, is_admin FROM users WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null); // row if found, null if not
        }
      }
    );
  });
};




const checkUserPassword = (email, password) => {

    const database = db.getDB()

    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            (err, user) => {
                if (err) return reject(err);
                if (!user) return reject("Email or Password is wrong");

                // Compare hashed password
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) return reject(err);
                    if (!match) return reject("Email or Password is wrong"); // wrong password

                    // Remove password before returning
                    delete user.password;
                    resolve(user);
                });
            }
        );
    })

}


export default { createUser, getUser, checkUserPassword}
