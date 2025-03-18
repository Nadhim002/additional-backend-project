import { addOrganisation , createChannels , createUsers , addusersToChannels , addMessagesinAllChannels } from "./dataInsertionHelper.js"
import { tableSizeWriter } from "./tableSizeFinder.js"
import dBCallWithPromise from "./promiseBasedDbCalls.js"

const totalNoOfOrganisation = 10
const totalNoOfUsers = 1000
const totalNoOfUsersPerChannel = 100

const noOfMessagesPerChannel = 1000
const totalNoOfChannelsPerOranganisation = 100

dBCallWithPromise
  .run("BEGIN TRANSACTION")
  .then(() => addOrganisation(totalNoOfOrganisation))
  .then(([lastID, _]) => {
    console.log(`${lastID} Orangisation has been Created`)
    return createChannels(totalNoOfChannelsPerOranganisation)
  })
  .then((data) => {
    console.log("Message ", data)
    return createUsers(totalNoOfUsers)
  })
  .then((data) => {
    console.log(data)
    return addusersToChannels()
  })
  .then((data) => {
    console.log("message", data)
    return addMessagesinAllChannels(noOfMessagesPerChannel)
  })
  .then(() => {
    return dBCallWithPromise.run("COMMIT")
  })
  .then( () => {    
    tableSizeWriter("noOfRowsPerTAable", noOfMessagesPerChannel)
    console.log("Sucessfully Added all messages")} )
  .catch((err) => {
    dBCallWithPromise.run("ROLLBACK")
    console.log(err.message)
    console.log(err.stack)
  })
