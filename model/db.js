const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

let connection = mysql.createConnection(process.env.CONNECTION_STRING);

const getRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM user_role', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const getDepartments = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM department', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const getRequests = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM request_view', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  })
}

const isUserExists = login => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT EXISTS(SELECT id FROM user WHERE login = '${login}')`, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(!!Object.values(rows[0])[0]);
    });
  });
}

module.exports = {
  getRoles,
  getDepartments,
  getRequests,
  isUserExists
};
