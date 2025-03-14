import DB from "./db.js"

// Data Fecther

export function dataFetcher(tableName, columnsToFectch, cb) {
  const sqlQuery = `select  ${columnsToFectch.join(",")} from ${tableName} `

  DB.all(sqlQuery, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    cb(data)
  })
}

// Create Organisation

function sqlQueryCreatorForOrganisation(noOfOrganisation) {
  const organisationNameTemplate = "Organisation-"

  const sqlQuery = " insert into organizations ( organization_name ) values "

  const list = []

  for (let i = 1; i < noOfOrganisation + 1; i++) {
    list.push(`("${organisationNameTemplate}${i}")`)
  }

  return sqlQuery + list.join(",") + ";"
}

function addOrganisation(noOfOrganisation) {

  DB.run(sqlQueryCreatorForOrganisation(10), function (err) {
    if (err) {
      console.log(err.message)
      return
    }

    console.log("Organisation Added Sucessfully")

    console.log(this.lastID)
  })

}

// addOrganisation( 10 )

//  Create Channel for Organisation

function allOrganizationRetriver(cb) {
  DB.all(
    "select organization_id from organizations",

    (err, data) => {
      if (err) {
        console.log(err.message)
        return
      }
      const organisationIndex = data.reduce(function (acc, curr) {
        acc.push(curr.organization_id)

        return acc
      }, [])

      cb(organisationIndex)
    }
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

  console.log(sqlQuery + list.join(",") + ";")

  return sqlQuery + list.join(",") + ";"
}

function createChannels(noOfChannelsInEachOrganisation) {
  allOrganizationRetriver((organisationIndexList) => {
    organisationIndexList.forEach((organisationIndex) => {
      DB.run(
        sqlQueryCreatorForChannels(
          organisationIndex,
          noOfChannelsInEachOrganisation
        ),
        function (err) {
          if (err) {
            console.log(err.message)
            return
          }

          console.log(
            ` Created Channels for ${organisationIndex}  and last added Channel id  is ${this.lastID}`
          )
        }
      )
    })
  })
}

// createChannels(1000)

function createUsers(noOfUsers) {
  DB.run(sqlQueryCreatorForUsers(noOfUsers), function (err) {
    if (err) {
      console.log(err.message)
      return
    }

    console.log(" Users Added Sucessfully ")

    console.log(this.lastID)
  })
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

// createUsers(1000)

//  Add users to Channel

// addusersToChannels()

function addusersToChannels() {
  dataFetcher("channels", ["channel_id"], (channel_ids) => {
    channel_ids.forEach((channel_id) => {
      addUsersToChannel(channel_id.channel_id)
    })
  })
}

// addusersToChannels()

function addUsersToChannel(channelId) {
  
  const sqlQueryTemplate = `insert into channel_subscribed_by_users  (  channel_id ,  user_id ) values `

  fecthRandomUserIds(100, 1000, function (users) {
    const usersSqlQuery = users
      .map((user) => `( ${channelId} , ${user})`)
      .join(",")

    DB.run(sqlQueryTemplate + usersSqlQuery, function (err) {
      if (err) {
        console.log(err)
        return
      }

      console.log(`Added users for Channel id ${channelId}`)
    })
  })
}

function fecthRandomUserIds(noOfIds, tableSize, cb) {

  const sqlQuery = `SELECT  user_id FROM users LIMIT ${noOfIds} OFFSET ?`
  let randomNumber = parseInt(Math.random() * tableSize)

  if (randomNumber > tableSize - noOfIds) {
    randomNumber -= noOfIds
  }

  DB.all(
    sqlQuery,
    [randomNumber],

    (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      data = data.reduce(function (acc, curr) {
        acc.push(curr.user_id)

        return acc
      }, [])

      cb(data)
    }
  )

}

//  Creating Messages

export function addMessagesinAllChannels(noOfMessagesToAdd) {
  dataFetcher("channels", ["channel_id"], function (channel_ids) {
    channel_ids.forEach(function (channel_id) {
      addMessageInChannel(channel_id.channel_id, noOfMessagesToAdd)
    })
  })
}

export function addMessageInChannel(channelId, noOfMessagesToAdd) {
  
  const noOfUsersPerChannel = 100
  const noOfMessagesPeruser = noOfMessagesToAdd / noOfUsersPerChannel

  selectUsersofGivenChannel(channelId, function (users) {
    users.forEach(function (user) {
      addMessageOfGivenUserInGivenChannel(user, channelId, noOfMessagesPeruser)
    })
  })
}

export function addMessageOfGivenUserInGivenChannel(
  user_id,
  channel_id,
  noOfMessages
) {
  let sqlQuery =
    " insert into message ( content , user_id_posted , channel_id_posted ) values "

  const listOfSqlQuery = []

  for (
    let messageNumber = 1;
    messageNumber < noOfMessages + 1;
    messageNumber++
  ) {
    listOfSqlQuery.push(
      `( "${user_id}-${channel_id}-MessageNo-${messageNumber}" , ${user_id} , ${channel_id} )`
    )
  }

  sqlQuery += listOfSqlQuery.join(",")

  DB.run(sqlQuery, function (err) {
    if (err) {
      console.log(err.message)
      return
    }

    console.log(`Added Messages for User ${user_id} Channel ${channel_id}`)
  })
}

export function selectUsersofGivenChannel(channelId, cb) {
  console.log(`selecting user_id for channel ${channelId}`)

  const sqlQuery = ` select * from channel_subscribed_by_users where channel_id = ? `

  DB.all(sqlQuery, [channelId], function (err, data) {
    if (err) {
      console.log(err.message)
      return
    }

    cb(
      data.reduce((acc, curr) => {
        acc.push(curr.user_id)

        return acc
      }, [])
    )
  })
}

// addOrganisation(10)
// createChannels(100)
// createUsers( 1000 )
// addusersToChannels()

// addMessageInChannel( 5 , 500 )

// addMessagesinAllChannels( 1000 )

// DB.run( "drop table message")
