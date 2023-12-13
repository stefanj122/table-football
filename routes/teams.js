var express = require('express');
const conn = require('../config/mysql');
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
    console.log(req.body);
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
