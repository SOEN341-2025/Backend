import db from "../utils/db.mjs";
import Organization from "./organization.mjs";

const addEvent = async (title, icon, description, price, capacity, date, created_date, location, org_id) => {
    const org = await Organization.getOrganization(org_id);
    if (!org) throw Error(`Organization ${org_id} not found`);

    const database = db.getDB();

    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO events (title, icon, description, price, capacity, date, created_date, location, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, icon, description, price, capacity, date, created_date, location, org_id],
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            }
        );
    });
};

const deleteEventById = (id) => {
    const database = db.getDB();
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM events WHERE id = ?`, [id], function (err) {
            if (err) return reject(err);
            resolve(this.changes > 0);
        });
    });
};

const getEventById = (id) => {
    const database = db.getDB();

    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM events WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || undefined); // row if found, undefined if not
                }
            }
        );
    });
};

const getAllEvents = () => {
    const database = db.getDB();
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM events`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const getEventTickets = async (id) => {
    const database = db.getDB()
    const tickets_userId = await new Promise( (resolve, reject) => {
        database.all( `SELECT * FROM tickets WHERE event_id = ?`, [id], (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
        })
    })

    if(tickets_userId.length === 0 ) {
        return []
    }
    const userIds = tickets_userId.map(r => r.user_id);
    const placeholders = userIds.map(() => '?').join(',');

    const users = await new Promise( (resolve, reject) => {
        database.all(
            `SELECT id, email, name FROM users WHERE id IN (${placeholders})`,
            userIds,
            (err, users) => {
                if (err) return reject(err);
                resolve(users);
            }
        );
    })

    console.log(users)

    
    const user_map = Object.fromEntries(
        users.map( u => [u.id, u])
    )

    return tickets_userId.map(t => {

        let newTicketObject = {
            ...t,
            user: user_map[t.user_id]
        }
        
        delete newTicketObject.user_id

        return newTicketObject
    })

}

export default { addEvent, getEventById, getAllEvents, deleteEventById, getEventTickets};