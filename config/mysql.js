const mysql = require('mysql2');

const conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'pejic',
    database: 'tablefootball'
})

conn.query('CREATE TABLE IF NOT EXISTS users(\n' +
    '\tId INT PRIMARY KEY AUTO_INCREMENT,\n' +
    '\tName VARCHAR(100) NOT NULL,\n' +
    '\tIsPresent BOOL NOT NULL DEFAULT TRUE\n' +
    ');')

conn.query('CREATE TABLE IF NOT EXISTS single(\n' +
    'Id INT PRIMARY KEY AUTO_INCREMENT,' +
    'player_one INT NOT NULL,' +
    'player_two INT NOT NULL,' +
    'result VARCHAR(50) NOT NULL' +
    ');')

conn.query('CREATE TABLE IF NOT EXISTS teams(\n' +
    'Id INT PRIMARY KEY AUTO_INCREMENT,' +
    'to_player_one INT NOT NULL,' +
    'to_player_two INT NOT NULL,' +
    'tw_player_one INT NOT NULL,' +
    'tw_player_two INT NOT NULL,' +
    'result VARCHAR(50) NOT NULL' +
    ');')
module.exports = conn;
