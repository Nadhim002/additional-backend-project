import fs from "fs/promises"
import dBCallWithPromise from "./promiseBasedDbCalls.js"

const tableNames = [
  "organizations",
  "channels",
  "users",
  "channel_subscribed_by_users",
  "messages",
]

async function tableSizeFinder(tableName) {
  const sqlQuery = `SELECT COUNT(*) AS noOfRows FROM ${tableName}`
  return await dBCallWithPromise
    .get(sqlQuery)
    .then((row) => `No Of Rows in ${tableName} Table : ${row.noOfRows} Rows`)
}

export function tableSizeWriter(fileName, noOfMessagesPerChannel) {
  fs.appendFile(
    fileName,
    `Table for no of messages per channel ${noOfMessagesPerChannel} \n`
  )
    .then(() => {
      return Promise.all(tableNames.map(tableSizeFinder))
    })
    .then((results) => {
      return fs.appendFile(fileName, results.join("\n"))
    })
    .then(() => fs.appendFile(fileName, "\n \n"))
    .catch((err) => {
      console.log(err.message)
    })
}
