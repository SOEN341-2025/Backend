
import db from "../Helpers/db.mjs"


const getAllRoles = () => {

    const database = db.getDB()

    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM roles`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    })

}


const addRole = (name) => {

    const database = db.getDB()
    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO roles (name) VALUES (?)`,
            [name],
            function(err) {
                if (err) return reject(err)    
                resolve(this.lastID)        
            }
        )
    })
}

export default {getAllRoles, addRole}