const mysql = require('mysql')

pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'db',
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_PASSWORD,
  database        : process.env.MYSQL_DATABASE,
  port            : parseInt(process.env.MYSQL_PORT || 3306, 10)
})

module.exports = pool