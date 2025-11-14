import db from "../utils/db.mjs"
import Event from "./event.mjs"
import bcrypt from "bcrypt";


const createUser = (name, email, password, isAdmin = false) => {

  const database = db.getDB()

  return new Promise((resolve, reject) => {

    // Hashing the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err)
      
      database.run(
        `INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)`,
        [name, email, hash, isAdmin],

        function (err) {
          if (err) return reject(err)            
          resolve(this.lastID)
        }

      );
    });
  })
}

const getAllUsers = () => {

  const database = db.getDB()

  return new Promise((resolve, reject) => {

    database.all(`SELECT id, name, email, is_admin FROM users`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });

  })

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


const checkUserPassword = async (email, password) => {

    const database = db.getDB()

    let user = await new Promise((resolve, reject) => {
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

    return user
}

const getUserOrganizations = async (userId) => {


  const database = db.getDB()
  const organizationRows = await new Promise((resolve, reject) => {
    database.all(
      `SELECT org_id FROM organization_roles WHERE user_id = ?`,
      [userId],
      (err, rows) => {
        if (err) return reject(err)
        resolve(rows || [])
      }
    )
  })

  if (organizationRows.length === 0) return [];

  const organizationIds = organizationRows.map(r => r.org_id);
  const placeholders = organizationIds.map(() => '?').join(',');


  return await new Promise((resolve, reject) => {
        database.all(
            `SELECT id, name, icon FROM organizations WHERE id IN (${placeholders})`,
            organizationIds,
            (err, rows) => {
                if (err) return reject(err)
                resolve(rows || [])
            }
        )
  })
}

const deleteUser = (id) => {

  const database = db.getDB()

  return new Promise((resolve, reject) => {

    database.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('Error deleting row:', err.message);
        reject(err)
      } else {
        console.log(`Row(s) deleted: ${this.changes}`);
        resolve(this.changes)
      }
    });

  })  

}

const addTicket = async (user_id, event_id) => {

  const database = db.getDB()

  const user = await getUser(user_id)
  if(!user) throw new Error(`User ${user_id} not found`);

  const event = await Event.getEventById(event_id)
  if(!event) throw new Error(`Event ${event_id} not found`)

  return await new Promise((resolve, reject) => {

    database.run(
      `INSERT INTO tickets (user_id, event_id, status) VALUES (?, ?, ?)`,
      [user_id, event_id, 1],

      function (err) {
        if (err) return reject(err)            
          resolve(this.lastID)
        }

    );

  })
}


const getUserTickets = async (id) => {
  const database = db.getDB();

  const rows = await new Promise((resolve, reject) => {
    database.all(
      `SELECT event_id FROM tickets WHERE user_id = ?`,
      [id],
      (err, rows) => {
        if (err) return reject(err);
        if (!rows || rows.length === 0) return resolve([]); // no tickets
        resolve(rows);
      }
    );
  });

  const eventIds = rows.map(r => r.event_id);
  if (eventIds.length === 0) return [];

  const placeholders = eventIds.map(() => '?').join(',');

  return await new Promise((resolve, reject) => {
    database.all(
      `SELECT * FROM events WHERE id IN (${placeholders})`,
      eventIds,
      (err, events) => {
        if (err) return reject(err);
        resolve(events);
      }
    );
  });
};


export default { createUser, getUser, getUserOrganizations, checkUserPassword, getAllUsers, deleteUser, getUserTickets, addTicket}