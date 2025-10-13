import db from "../utils/db.mjs"
import User from "./user.mjs"
import Role from "./role.mjs"

const createOrganization = async (name, icon, description, creator_id) => {

    const user = await User.getUser(creator_id)
    if (!user) throw new Error(`User ${creator_id} not found`);

    const database = db.getDB()
    const org_id = await new Promise((resolve, reject) => {
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

    const ownerRole = await Role.getOwnerRole()
    const _ = await addUserToOrganization(org_id, user.id, ownerRole.id)

    return org_id
    
}

const getAllOrganizations = () => {

    const database = db.getDB()

    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM organizations`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    })

}

const getOrganization = (id) => {

    const database = db.getDB()
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM organizations WHERE id = ?`,
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

const getOrganizationEvents = async (id) => {

    const org = await getOrganization(id)
    if (!org) throw Error(`Organization ${id} not found`)

    const database = db.getDB()

    return await new Promise( (resolve, reject) => {

        database.all(`SELECT * FROM events WHERE org_id=? `, [id], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });

    })


}

const addUserToOrganization = async (organization_id, user_id, role_id) => {

    const user = await User.getUser(user_id)
    if (!user) throw new Error(`User ${user_id} not found`);
    
    const org = await getOrganization(organization_id)
    if (!org) throw Error(`Organization ${organization_id} not found`)

    const role = await Role.getRole(role_id)
    if (!role) throw Error(`Role ${role_id} not found`)

    const database = db.getDB()
    await new Promise((resolve, reject) => {

        database.run(
            `INSERT INTO organization_roles (user_id, role_id, org_id) VALUES (?, ?, ?)`,
            [user_id, role_id, organization_id],
            function (err) {
                if (err) {
                    return reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    })

    return true
}

const getOrganizationUsers = async (orgId) => {
    const database = db.getDB()
    const memberRoleId = await new Promise((resolve, reject) => {
        database.all(
            `SELECT * FROM organization_roles WHERE org_id=?`,
            [orgId],
            function (err) {
                if(err) {
                    return reject(err)
                }
                resolve(this.lastID)
            }
        )
    })

    if (memberRoleId.length == 0) return []

    const userIds = memberRoleId.map(u => u.user_id)
    const placeholders = memberRoleId.map(() => '?').join(',')

    const users = await new Promise((resolve, reject) => {
        database.all(
            `SELECT * FROM users WHERE id IN (${placeholders})`,
            userIds,
            (err, rows) => {
                if (err) return reject(err)
                resolve(rows)
            }
        )
    })

    const roles = await Role.getAllRoles()

    return user.map(users)

}

export default {createOrganization, getOrganizationEvents, addUserToOrganization, getOrganization, getAllOrganizations, getOrganizationUsers}