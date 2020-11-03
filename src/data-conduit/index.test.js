const database = require('./index.js')
const env = require('dotenv').config()

test('connection failure is catchable (no credentials supplied)', async () => {
    expect( await database.init({
            uri: null,
            port: null,
            database: null
    })).toEqual(
        expect.objectContaining({
            status:`error`,
            message: expect.any(String)
        })
    )
})

test('connects to server', async () => {
    expect(await database.init({
        uri: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    })).toEqual(
        expect.objectContaining({
            status:`ok`, 
            message: expect.any(String)
        })
    )
})

test('can grab handle to database connection', () => {
    expect( database.connection() ).toBeDefined()
})

test('can perform basic query (insertOne)', async () => {
    const result = await database
        .connection()
        .collection('jestTestCollection')
        .insertOne({foo:'bar'})
    expect(result.result).toEqual(
        expect.objectContaining({
            ok : 1,
            n: 1
        })
    )
})

test('can remove documents (deleteMany)', async () => {
    const result = await database
        .connection()
        .collection('jestTestCollection')
        .removeMany({foo:'bar'})
    expect(result.result).toEqual(
        expect.objectContaining({
            ok : 1,
            n : 1
        })
    )
})

test('can remove collection', async () => {
    const result = await database
        .connection()
        .collection('jestTestCollection')
        .drop()
    expect(result).toBe(true)
})

afterAll(done => {
    if(database && database.connectionStatus)
        database.disconnect()
    done()
})