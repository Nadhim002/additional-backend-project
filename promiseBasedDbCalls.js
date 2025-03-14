import DB from "./db.js"

class dBCallWithPromise {
  static run(sqlQuery, values) {
    if (!values) {
      values = []
    }

    return new Promise(function (res, rej) {
      DB.run(sqlQuery, values, function (err) {
        if (err) {
          rej(err)
        }

        res([this.lastID, this.changes])
      })
    })
  }

  static get(sqlQuery, values) {
    if (!values) {
      values = []
    }

    return new Promise(function (res, rej) {
      DB.get(sqlQuery, values, function (err, row) {
        if (err) {
          rej(err)
        }

        res(row)
      })
    })
  }

  static all( sqlQuery, values ) {

    if (!values) {
      values = []
    }

    return new Promise(function (res, rej) {
      DB.all(sqlQuery, values, function (err, rows) {
        if (err) {
          rej(err)
        }

        res(rows)
      })
    })
  }
}

export default dBCallWithPromise 