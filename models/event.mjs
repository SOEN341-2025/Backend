import db from "../utils/db.mjs";
import Organization from "./organization.mjs";

const addEvent = async (title, icon, description, price, capacity, date, location, org_id) => {
    const org = await Organization.getOrganization(org_id);
    if (!org) throw Error(`Organization ${org_id} not found`);

    const database = db.getDB();

    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO events (title, icon, description, price, capacity, date, location, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, icon, description, price, capacity, date, location, org_id],
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

export default { addEvent, getEventById, getAllEvents, deleteEventById };