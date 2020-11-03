'use strict'

const mongoClient     = require('mongodb').MongoClient

const DataConduit = function() {
  let connection          = null
  let dbo                 = null
  let selectedDatabase    = null
  let connectionString    = null
  
  const connect = async () => {
    connection = await mongoClient.connect(connectionString, { useUnifiedTopology: true }).catch(err=>{
      if(err) {
        console.log({result:'error', message:'database connection error', data: err, connectionData: dbUrl})
      }
    }) //, function(err, db) {}
    dbo = connection.db(selectedDatabase)
  }

  this.init = async (options={}) => {
    let result = {}
    connectionString = `mongodb://${options.uri}:${options.port}/`
    selectedDatabase = options.database
    if(!options.uri || !options.port || !options.database) {
        return {status:`error`, message: `connection string parameters not supplied`}
    }

    await connect()

    return dbo ? {status:'ok', message: `connected`} : {status:'error', message: `could not establish connection`}
  }
  
  this.connectionStatus = () => {
    return dbo ? true : false
  }

  this.disconnect = () => {
    connection.close()
  }

  this.connection = () => {
    return dbo
  }

}

module.exports = new DataConduit()