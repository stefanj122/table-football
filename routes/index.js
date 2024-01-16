var express = require('express');
var router = express.Router();
const conn = require('../config/mysql');
const calculateSingle = require('../helpers/calculate-score');

/* GET home page. */
router.get('/', async function (req, res) {
  const date = new Date();
  const {thisYear, month } = req.query;
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
  const arr = [];
  let query = `SELECT t.id, t.result, t.created_at, CONCAT(u1.Id,"/",u2.Id) as player_one,
        CONCAT(u3.Id,"/",u4.Id) as player_two, 
        CONCAT(u1.Name,", ",u2.Name) as playerOne,
        CONCAT(u3.Name,', ',u4.Name) as playerTwo
        FROM teams as t
         LEFT JOIN users as u1 ON u1.id = t.to_player_one
         LEFT JOIN users as u2 ON u2.id = t.to_player_two
         LEFT JOIN users as u3 ON u3.id = t.tw_player_one
         LEFT JOIN users as u4 ON u4.id = t.tw_player_two `;
  if (thisYear === 'true') {
    query += `WHERE YEAR(created_at) = ?`;
    arr.push(date.getFullYear());
    if(month !== 'null'){
      query +=  ` AND MONTH(created_at) = ?`;
      arr.push(month);
    }
  }

  const team = new Promise((resolve, reject) => {
    conn.query(
      query,
      arr,
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
  res.render('index', {
    single: singleRes,
    team: teamsRes,
    users: await users,
    thisYear,
    selectedMonth: month,
  });
});

module.exports = router;
