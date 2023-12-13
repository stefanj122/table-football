var express = require('express');
const conn = require('../config/mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (_req, res) {
  const users = new Promise((resolve, reject) => {
    conn.query('SELECT * FROM users', (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
  res.render('users', { users: await users });
});

router.post('/', async function (req, res) {
  const { name } = req.body;
  const users = new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO users(Id, Name) VALUES (null, \'${name}\')`,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
  await users;
  res.redirect('/users');
});

router.get('/del/:id', (req, res) => {
  const { id } = req.params;

  conn.query('DELETE FROM users WHERE Id =' + id);
  res.redirect('/users');
});

router.get('/toggle/:id', (req, res) => {
  const { id } = req.params;
  const uset = new Promise((resolve, reject) => {
    conn.query('SELECT * FROM users WHERE Id = ' + id, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });

  uset.then((val) => {
    conn.query(
      `UPDATE users
                    SET IsPresent = ${!val[0].IsPresent}
                    WHERE Id =` + val[0].Id
    );
  });
  res.redirect('/users');
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = new Promise((resolve, reject) => {
    conn.query(
      `SELECT s.id,s.result, u1.Name as p1, u2.Name as p2
         FROM single as s 
         LEFT JOIN users as u1 ON u1.id = s.player_one
         LEFT JOIN users as u2 ON u2.id = s.player_two
         WHERE player_one = ? OR player_two = ?`,
      [id, id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });

  const teams = new Promise((resolve, reject) => {
    conn.query(
      `SELECT t.id,t.result, u1.Name as p1, u2.Name as p2, u3.Name as p3, u4.Name as p4
         FROM teams as t 
         LEFT JOIN users as u1 ON u1.id = t.to_player_one
         LEFT JOIN users as u2 ON u2.id = t.to_player_two
         LEFT JOIN users as u3 ON u3.id = t.tw_player_one
         LEFT JOIN users as u4 ON u4.id = t.tw_player_two
         WHERE to_player_one = ? OR to_player_two = ? OR tw_player_one = ? OR tw_player_two = ?`,
      [id, id, id, id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
  return res.render('user', { users: await user, teams: await teams });
});

module.exports = router;
