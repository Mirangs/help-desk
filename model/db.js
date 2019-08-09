const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const pool = mysql.createPool(process.env.CONNECTION_STRING);

const toMySQLDate = list => {
  return list.map(row => ({
    ...row,
    date: row.date.toISOString().slice(0, 10)
  }));
}

const getRoles = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM user_role', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const getDepartments = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM department', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const getRequests = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM request_view ORDER BY date DESC', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(toMySQLDate(rows));
    });
  })
}

const isUserExists = login => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT COUNT(id) FROM user WHERE login = '${login}'`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!Object.values(rows[0])[0]);
      }
    });
  });
}

const addUserRole = (userId, userRoleId) => {
  const sql = `
    INSERT INTO user_user_role (user_id, user_role_id) VALUES (${userId}, ${userRoleId});
  `;
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
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
    pool.query(sql, (err, rows) => {
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
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.insertId);
      }
    });
  });
}

const getTasksByUser = id => {
  let sql = `
    SELECT * FROM request_view WHERE performer_id = ?
  `;
  const inserts = [id];
  sql = mysql.format(sql, inserts);

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(toMySQLDate(rows));
      }
    });
  });
}

const getUsersByRole = roleId => {
  let sql = `
    SELECT id, first_name, last_name FROM user WHERE department_id = ?
  `;
  const inserts = [roleId];
  sql = mysql.format(sql, inserts);

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getRequestStatuses = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM request_status', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const updateIssue = payload => {
  let sql;
  if (Object.keys(payload).includes('performer')) {
    if (payload.performer === '0') {
      sql = `
      UPDATE request SET performer_id = NULL WHERE id = '${payload.id}';
      `;
    } else {
      sql = `
        UPDATE request SET performer_id = ? WHERE id = ?
      `;
      const inserts = [payload.performer, payload.id];
      sql = mysql.format(sql, inserts);
    }
  } if (Object.keys(payload).includes('request-status')) {
    sql = `
      UPDATE request SET req_status_id = ? WHERE id = ?
    `;
    const inserts = [payload['request-status'], payload.id];
    sql = mysql.format(sql, inserts);
  }

  return new Promise((resolve, reject) => {
    pool.query(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const getUserByLogin = login => {
  let sql = `
    SELECT * FROM user WHERE login = ?
  `;
  const inserts = [login];
  sql = mysql.format(sql, inserts);
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

const getUserById = id => {
  let sql = `
    SELECT * FROM user WHERE id = ?
  `
  const inserts = [id];
  sql = mysql.format(sql, inserts);

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

const getRequestsByLogin = login => {
  let sql = `
    SELECT id, req_status, performer_first_name, performer_last_name, date, payload, critical FROM request_view r WHERE login = ?
  `;

  const inserts = [login];
  sql = mysql.format(sql, inserts);

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(toMySQLDate(rows));
      }
    });
  });
}

module.exports = {
  pool,
  getRoles,
  getDepartments,
  getRequests,
  isUserExists,
  addUser,
  addUserRole,
  addIssue,
  getTasksByUser,
  getUsersByRole,
  getRequestStatuses,
  updateIssue,
  getUserByLogin,
  getUserById,
  getRequestsByLogin
};
