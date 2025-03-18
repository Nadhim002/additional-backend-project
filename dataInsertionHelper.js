import dBCallWithPromise from "./promiseBasedDbCalls.js"

const totalNoOfOrganisation = 10
const totalNoOfUsers = 1000
const totalNoOfUsersPerChannel = 100

const noOfMessagesPerChannel = 1000
const totalNoOfChannelsPerOranganisation = 100

// Add organisaton

function sqlQueryCreatorForOrganisation(noOfOrganisation) {
  const organisationNameTemplate = "Organisation-"
  const sqlQuery = " insert into organizations ( organization_name ) values "
  const list = []
  for (let i = 1; i < noOfOrganisation + 1; i++) {
    list.push(`("${organisationNameTemplate}${i}")`)
  }
  return sqlQuery + list.join(",") + ";"
}

export function addOrganisation(noOfOrganisation) {
  const sqlQuery = sqlQueryCreatorForOrganisation(noOfOrganisation)
  return dBCallWithPromise.run(sqlQuery)
}

// Add Channels for Organisations

async function allOrganizationRetriver() {
  return await dBCallWithPromise
    .all("select organization_id from organizations")
    .then((data) =>
      data.reduce(function (acc, curr) {
        acc.push(curr.organization_id)

        return acc
      }, [])
    )
}

function sqlQueryCreatorForChannels(organisationId, noOfChannels) {
  const organisationNameTemplate = `Channel-${organisationId}`
  const sqlQuery =
    " insert into channels ( channel_name , organization_id ) values "

  const list = []

  for (let channelNo = 1; channelNo < noOfChannels + 1; channelNo++) {
    list.push(
      `( "${organisationNameTemplate}---${channelNo}" , ${organisationId} )`
    )
  }

  return sqlQuery + list.join(",") + ";"
}

export function createChannels(noOfChannelsInEachOrganisation) {
  return new Promise((res, rej) => {
    let noOfOrganisationsChannelCreated = 0

    allOrganizationRetriver().then((organisationIndexList) => {
      organisationIndexList.forEach((organisationIndex) => {
        dBCallWithPromise
          .run(
            sqlQueryCreatorForChannels(
              organisationIndex,
              noOfChannelsInEachOrganisation
            )
          )
          .then(([lastID, _]) => {
            console.log(
              ` Created Channels for ${organisationIndex}  and last added Channel id  is ${lastID}`
            )

            noOfOrganisationsChannelCreated++
            if (noOfOrganisationsChannelCreated == totalNoOfOrganisation) {
              res("Channel Creation Process Completed ")
            }
          })
          .catch((err) => rej(err))
      })
    })
  })
}

//  Add Users

export async function createUsers(noOfUsers) {
  return await dBCallWithPromise
    .run(sqlQueryCreatorForUsers(noOfUsers))
    .then(([lastID, _]) => {
      return `${lastID} Users has Been Created`
    })
    .catch((err) => err)
}

function sqlQueryCreatorForUsers(noOfUsers) {
  const sqlQuery = "insert into users ( user_name ) values "
  const listOfUsers = []
  const userTemplate = "User"

  for (let user = 1; user < noOfUsers + 1; user++) {
    listOfUsers.push(`("${userTemplate}--${user}")`)
  }

  return sqlQuery + listOfUsers.join(",") + ";"
}

// Add users in Channels

async function fecthRandomUserIds(noOfIds, tableSize) {
  const sqlQuery = `SELECT  user_id FROM users LIMIT ${noOfIds} OFFSET ?`
  let randomNumber = parseInt(Math.random() * tableSize)

  if (randomNumber > tableSize - noOfIds) {
    randomNumber -= noOfIds
  }

  return dBCallWithPromise.all(sqlQuery, [randomNumber]).then((data) =>
    data.reduce(function (acc, curr) {
      acc.push(curr.user_id)
      return acc
    }, [])
  )
}

function addUsersToChannel(channelId) {
  return new Promise(function (res, rej) {
    const sqlQueryTemplate = `insert into channel_subscribed_by_users  (  channel_id ,  user_id ) values `
    fecthRandomUserIds(totalNoOfUsersPerChannel, totalNoOfUsers).then(
      (users) => {
        const usersSqlQuery = users
          .map((user) => `( ${channelId} , ${user})`)
          .join(",")

        dBCallWithPromise.run(sqlQueryTemplate + usersSqlQuery).then(() => {
          res(`Added users to channel with ID ${channelId}`)
        })
      }
    )
  })
}

async function allCHannelIdFecther() {
  return dBCallWithPromise
    .all("select channel_id from channels ")
    .then((channel_ids) =>
      channel_ids.reduce((acc, channel_id) => {
        acc.push(channel_id.channel_id)

        return acc
      }, [])
    )
}

export async function addusersToChannels() {
  let promiseResolver

  const channel_ids = await allCHannelIdFecther()
  promiseResolver = channel_ids.map((channel_id) =>
    addUsersToChannel(channel_id)
  )
  return await Promise.all(promiseResolver)
}

// Add Messages in Channel

export async function addMessagesinAllChannels(noOfMessagesPerChannel) {

    const channelIds = await allCHannelIdFecther()

    const promiseResolver = channelIds.map((channelId) =>
        addMessageInGivenChannel(channelId, noOfMessagesPerChannel)
      )
    
    return await Promise.all(promiseResolver)

}


async function selectUsersofGivenChannel(channelId) {
  const sqlQuery = ` select * from channel_subscribed_by_users where channel_id = ? `

  const data = await dBCallWithPromise.all(sqlQuery, [channelId])
  return data.reduce((acc, curr) => {
    acc.push(curr.user_id)
    return acc
  }, [])
}

async function addMessageInGivenChannel(channelId, noOfMessagesToAdd) {



  const noOfMessagesPeruser = noOfMessagesToAdd / totalNoOfUsersPerChannel

  const usersId = await selectUsersofGivenChannel(channelId)

  const promiseResolver = usersId.map((userId) =>
    addMessageOfGivenUserInGivenChannel(
      userId,
      channelId,
      noOfMessagesPeruser
    )
  )

  return  Promise.all(promiseResolver)

}

async function addMessageOfGivenUserInGivenChannel(
  user_id,
  channel_id,
  noOfMessagesPeruser
) {
  let sqlQuery =
    "insert into messages ( content , user_id_posted , channel_id_posted ) values "
  const listOfSqlQuery = []
  for (
    let messageNumber = 1;
    messageNumber < noOfMessagesPeruser + 1;
    messageNumber++
  ) {
    listOfSqlQuery.push(
      `( "${user_id}-${channel_id}-MessageNo-${messageNumber}" , ${user_id} , ${channel_id} )`
    )
  }
  sqlQuery += listOfSqlQuery.join(",")

  return await dBCallWithPromise.run(sqlQuery)
}

export async function delelteAllmessages(){ 

    const sqlQuery = "delete from messages " 

    return await dBCallWithPromise.run(sqlQuery)

}

delelteAllmessages()