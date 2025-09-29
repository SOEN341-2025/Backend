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

}

const checkUserPassword = (email, password) => {

}

const editUser = (id, name, email, password) => {

}


export default { createUser, getUser}