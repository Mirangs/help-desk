const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

let connection = mysql.createConnection(process.env.CONNECTION_STRING);
connection.on('error', err => {
  if (err === 'PROTOCOL_CONNECTION_LOST' || !err.fatal) {
    connection.connect();
  }
});

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
    connection.query(`SELECT COUNT(id) FROM user WHERE login = '${login}'`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!Object.values(rows[0])[0]);
      }
    });
  });
}

const addUserRole = (userId, userRoleId) => {
  connection.connect();
  const sql = `
    INSERT INTO user_user_role (user_id, user_role_id) VALUES (${userId}, ${userRoleId});
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        connection.end();
        reject(err);
      } else {
        connection.end();
        resolve('OK');
      }
    });
  });
}

const addUser = (user) => {
  const sql = `
    INSERT INTO user (department_id, first_name, last_name, middle_name, login, password, phone, email, sex, birth)
    VALUES (${user.department}, '${user['first-name']}', '${user['last-name']}', '${user['middle-name']}', '${user.login}', 
            '${user.pass}', '${user.phone}', '${user.email}', ${user.sex === 'm' ? 1 : 0}, '${user.birthday}');
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.insertId);
      }
    });
  });
}

const addIssue = issue => {
  let sql = `
    INSERT INTO request (creator_id, req_status_id, performer_id, date, payload, critical)
    VALUES (?, ?, ?, NOW(), ?, ?);
  `;
  const inserts = [issue.creator_id, issue.req_status_id, issue.performer_id, issue.payload, issue.critical];
  sql = mysql.format(sql, inserts);
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.insertId);
      }
    });
  });
}

module.exports = {
  connection,
  getRoles,
  getDepartments,
  getRequests,
  isUserExists,
  addUser,
  addUserRole,
  addIssue
};
