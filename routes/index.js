var express = require('express');
var router = express.Router();
const conn = require('../config/mysql');
const calculateSingle = require('../helpers/calculate-score');

/* GET home page. */
router.get('/', async function (_req, res) {
  const users = new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM users`, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });

  const single = new Promise((resolve, reject) => {
    conn.query(
      `SELECT s.id,s.player_one,s.player_two, s.result, u1.Name as playerOne, u2.Name as playerTwo
                    FROM single as s
                             LEFT JOIN users as u1 ON u1.id = s.player_one
                             LEFT JOIN users as u2 ON u2.id = s.player_two`,
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });

  const team = new Promise((resolve, reject) => {
    conn.query(
      `SELECT t.id, t.result, CONCAT(u1.Name,", ",u2.Name) as playerOne, CONCAT(u3.Name,', ',u4.Name) as playerTwo
                    FROM teams as t
                             LEFT JOIN users as u1 ON u1.id = t.to_player_one
                             LEFT JOIN users as u2 ON u2.id = t.to_player_two
                             LEFT JOIN users as u3 ON u3.id = t.tw_player_one
                             LEFT JOIN users as u4 ON u4.id = t.tw_player_two`,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
  const singleRes = calculateSingle(await single);
  const teamsRes = calculateSingle(await team);
  console.log(teamsRes);
  res.render('index', {
    single: singleRes,
    team: teamsRes,
    users: await users,
  });
});

module.exports = router;
