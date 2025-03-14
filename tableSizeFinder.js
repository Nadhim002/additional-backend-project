
import DB  from "./db.js"
import fs from "fs/promises"

const tableNames = [ "organizations" , "channels" , "users" , "channel_subscribed_by_users" , "message"  ]

function tableSizeFinder(tableName) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT COUNT(*) AS noOfRows FROM ${tableName}`
        DB.get(sqlQuery, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(`No Of Rows in ${tableName} Table : ${rows.noOfRows} Rows`)
            }
        });
    });
}

fs.writeFile("./noOfRowsPerTableForHundredMillionMessages", "")
    .then(() => {
        return Promise.all(tableNames.map(tableSizeFinder))
    })
    .then((results) => {
        return fs.appendFile("./noOfRowsPerTable", results.join("\n"))
    })
    .catch((err) => {
        console.log(err.message)
    });
