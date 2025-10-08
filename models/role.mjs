
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

const getRole = (id) => {

    const database = db.getDB()

    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM roles WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null); // row if found, null if not
                }
            }
        );
    })
}

const getOwnerRole = () => {
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM roles WHERE name = owner`,
            [],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null); // row if found, null if not
                }
            }
        );
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

export default {getAllRoles, addRole, getRole, getOwnerRole}