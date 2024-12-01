/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

// MernStack
// V6L6P5chsvGpJ5gx
import { env } from './environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = env.MONGODB_URI
const DATABASE_NAME = env.DATABASE_NAME

let trelloDatabaseInstance = null
// Khoi tao mot doi tuong client instace ket noi den db
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
export const CONNECT_DB = async () => {
  // goi ket noi den mongodb atlas
  await mongoClientInstance.connect()

  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)

}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')
  return trelloDatabaseInstance
}
// Dong Database
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}
