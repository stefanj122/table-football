var express = require('express');
const conn = require('../config/mysql');
const calculateSingle = require('../helpers/calculate-score');
var router = express.Router();

/* GET users listing. */
router.get('/gen', async function (req, res, next) {
  const users = new Promise((resolve, reject) => {
    conn.query('SELECT * FROM users WHERE IsPresent = 1', (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
  users.then((val) => {});
  res.render('users', { users: await users });
});

router.post('/score', async function (req, res) {
  const { to_po, to_pt, tt_po, tt_pt, result } = req.body;
  if (!to_pt || !tt_pt) {
    const users = new Promise((resolve, reject) => {
      conn.query(
        `INSERT INTO single(Id, player_one, player_two, result)
                        VALUES (null, ?, ?, ?)`,
        [to_po, tt_po, result],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
    await users;
  } else {
    const users = new Promise((resolve, reject) => {
      conn.query(
        `INSERT INTO teams(Id, to_player_one, to_player_two, tw_player_one, tw_player_two, result)
                        VALUES (null, ?, ?, ?, ?, ?)`,
        [
          Math.min(to_po, to_pt),
          Math.max(to_po, to_pt),
          Math.min(tt_po, tt_pt),
          Math.max(tt_po, tt_pt),
          result,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
    await users;
  }
  res.redirect('/');
});

router.get('/:id1/:id2',async (req,res) =>{
  const {id1,id2} = req.params;
  const team = new Promise((resolve,reject)=>{
    conn.query(`SELECT Name FROM users WHERE Id = ? OR Id = ?`,[id1,id2],(err,result)=>{
      if (err) reject(err);
      resolve(result);
    })
  })
  const names = team.then((value)=>{
   return value[0].Name + ', '+ value[1].Name;
  })
  const teams = new Promise((resolve,reject)=>{
    conn.query(
      `SELECT t.id,t.created_at, t.result, CONCAT(u1.Name,", ",u2.Name) as playerOne, CONCAT(u3.Name,', ',u4.Name) as playerTwo
                    FROM teams as t
                             LEFT JOIN users as u1 ON u1.id = t.to_player_one
                             LEFT JOIN users as u2 ON u2.id = t.to_player_two
                             LEFT JOIN users as u3 ON u3.id = t.tw_player_one
                             LEFT JOIN users as u4 ON u4.id = t.tw_player_two
                              WHERE (u1.id = ? AND u2.id = ?) OR (u3.id = ? AND u4.id = ?) ORDER BY id DESC`,[id1,id2,id1,id2],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  })

  res.render('showTeam',{team: await teams, names: await names })
})


async function getPlayer(id) {
  const user = new Promise((resolve, reject) => {
    conn.query('SELECT * FROM users WHERE Id = ?', [id], (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
  return await user;
}

module.exports = router;
