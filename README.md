# data-conduit v1.0.0
A simple singleton interface between MongoDB and your code. Manages one connection to many queries per process. Reuse your connection across multiple modules running under the same instance.

**Configure:**
Requires .env file at root of application  
*DB_HOST*=localhost  
*DB_PORT*=3333  
*DB_NAME*=your_database

**Usage:**   
const conduit = require('data-conduit')  
await conduit.init()  
const result = await conduit.connection().collection('collection-name').find({}).toArray()  
conduit.disconnect()  
