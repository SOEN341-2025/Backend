import db from "../Helpers/db.mjs"
import User from "./user.mjs"

const createOrganization = async (name, icon, description, owner_id) => {

    const database = db.getDB()

    let user;
    try {
        user = await User.getUser(owner_id)
        const lastId = new Promise((resolve, reject) => {
            database.run(
                `INSERT INTO organizations (name, icon, description) VALUES (?, ?, ?)`,
                [name, icon, description],
                function (err) {
                    if (err) {
                        console.error("Error inserting organization:", err.message);
                        return reject(err);
                    } else {
                        console.log("Organization created with ID:", this.lastID);
                        resolve(this.lastID); // return org id instead of just true
                    }
                }
            );
        })

        // Todo
        // Have to add user_role_organization
    }
    catch {
        return false
    }

    return true
    
}

const getOrganizationEvents = (id) => {

}

const addUserToOrganization = (id, user_id) => {

}

export default {createOrganization, getOrganizationEvents, addUserToOrganization}