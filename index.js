'use strict'

/**
 * Singleton wrapper for Mongo NodeJS client
 * 
 * @author
 * Brian Kenny <papaviking@gmail.com>
 * @example
 * // returns {status:'ok'|'error', message: '...'}
 * await database.init({
 *     uri:      process.env.HOST,
 *     port:     process.env.PORT,
 *     database: process.env.NAME,
 * })
 * @example
 * // returns handle to connection instance
 * database.connection()
 * @example
 * // disconnects singleton connection, be aware of that side effect
 * database.disconnect()
 * @returns null
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