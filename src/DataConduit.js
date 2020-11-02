'use strict'
const dotenv          = require('dotenv').config()
const mongoClient     = require('mongodb').MongoClient
const dbUrl           = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`
const path            = require('path')

const DataConduit = function() {
  let connection = null
  let dbo = null
  let selectedDatabase = null
  const connect = async () => {
    connection = await mongoClient.connect(dbUrl, { useUnifiedTopology: true }).catch(err=>{
      if(err) {
        console.log({result:'error', message:'database connection error', data: err, connectionData: dbUrl})
        process.exit()
      }
    }) //, function(err, db) {}
    dbo = connection.db(selectedDatabase||appSettings.databaseName)
    return
  }
  this.init = async (options={}) => {
    if(options.database) {
      selectedDatabase = options.database
    }
    await connect()
  }
  this.disconnect = () => {
    connection.close()
  }
  this.connection = () => {
    return dbo
  }
}

module.exports = new DataConduit()