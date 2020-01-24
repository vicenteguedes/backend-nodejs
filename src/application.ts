import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import { router as deposits } from './routes/deposits'
import { router as withdrawals } from './routes/withdrawals'
import { router as accounts } from './routes/accounts'
import * as config from 'config'

dotenv.config()

const application = express()
const db: string = config.get('db')

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log(error))

application.use(bodyParser.text())
application.use(express.json())
application.use(express.urlencoded({ extended: false }))
application.use(cors())
application.use('/deposits', deposits)
application.use('/withdrawals', withdrawals)
application.use('/accounts', accounts)

application.get('/', (req, res) => {
  res.send('Hello World!')
})

application.set('port', process.env.APP_PORT || 5000)

export { application }
