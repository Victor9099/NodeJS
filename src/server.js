import express from 'express'
import AsyncExitHook from 'async-exit-hook'
import { mapOrder } from '~/utils/sorts.js'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()
  
  // enable json.data
  app.use(express.json())
  
  //Su dung APi v1
  app.use('/v1', APIs_V1)
  
  //Middleware xu ly loi
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`
    )
  })
}
//Clean up sv tai day https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

AsyncExitHook((signal) => CLOSE_DB())

CONNECT_DB()
  .then(() => console.log('Connect success'))
  .then(() => START_SERVER())
  .catch((e) => {
    console.log(e)
    process.exit(0)
  })
