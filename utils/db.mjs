
import sqlite3 from "sqlite3"

let dbInstance = null;
let dbPath = './database.db';

const init = (path = './database.db') => {
    dbPath = path;
    if (dbInstance) {
        dbInstance.close();
    }
    dbInstance = null;
}

const getDB = () => {
    if (!dbInstance) {
        dbInstance = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Connected to SQLite database at ${dbPath}`);
        });
    }
    return dbInstance;
}


const createDB = () => {
  const db = getDB();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE,
          email TEXT UNIQUE,
          password TEXT,
          is_admin INTEGER
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE,
          icon TEXT,
          description TEXT
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS organization_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          role_id INTEGER,
          org_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (role_id) REFERENCES roles(id),
          FOREIGN KEY (org_id) REFERENCES organizations(id)
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          org_id INTEGER,
          title TEXT,
          icon TEXT,
          description TEXT,
          price REAL,
          capacity INTEGER,
          date TEXT,
          created_date TEXT,
          location TEXT,
          FOREIGN KEY (org_id) REFERENCES organizations(id)
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS saved_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          event_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (event_id) REFERENCES events(id)
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS organization_create_requests(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE,
          icon TEXT,
          description TEXT,
          creator_id  INTEGER,
          FOREIGN KEY (creator_id) REFERENCES users(id)
        )`
      )
      .run(
        `CREATE TABLE IF NOT EXISTS tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          event_id INTEGER,
          bought_time TEXT,
          status INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (event_id) REFERENCES events(id)
        )`,
        (err) => {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });
  });
};

 

const close = () => {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}

export default { createDB, getDB, init, close }
