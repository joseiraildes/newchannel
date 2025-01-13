const mysql = require("mysql2")

async function MySql(){
  const connection = await mysql.createPool({
    uri: "mysql://root:wLwvrMApzIesReRtFMtlhSZcSxSkikju@autorack.proxy.rlwy.net:11626/railway"
  })
  
  const pool = connection.promise()

  return pool
}


module.exports = MySql;