'use strict'

/**
 * Solves equations of the form a * x = b
 * @example
 * // returns null
 * globalNS.method1(5, 10);
 * @example
 * // returns 3
 * globalNS.method(5, 15);
 * @returns {Number} Returns the value of x for the equation.
 */

const mongoClient     = require('mongodb').MongoClient

const DataConduit = function() {
  let connection          = null
  let dbo                 = null
  let selectedDatabase    = null
  let connectionString    = null
  
  const connect = async () => {
    connection = await mongoClient.connect(connectionString, { useUnifiedTopology: true }).catch(err=>{
      if(err) {
        return {result:'error', message:'database connection error', data: err, connectionData: dbUrl}
      }
    })
    dbo = connection.db(selectedDatabase)
    return {status:'ok', message: `connected`}
  }

  this.init = async (options={}) => {
    let result = {}
    connectionString = `mongodb://${options.uri}:${options.port}/`
    selectedDatabase = options.database
    if(!options.uri || !options.port || !options.database) {
        return {status:`error`, message: `connection string parameters not supplied`}
    }

    const connectionResult = await connect()
    return connectionResult
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