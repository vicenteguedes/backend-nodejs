import * as express from 'express'
import * as Joi from 'joi'
import * as JoiObjectId from 'joi-objectid'
const joiObjectId = JoiObjectId(Joi)
import * as mongoose from 'mongoose'
import { Account } from '../models/account'

const router = express()

router.get('/', async (req, res) => {
  const accounts = await Account.find()
  return res.send(accounts)
})

router.get('/:id', async (req, res) => {
  const account = await Account.findById(mongoose.Types.ObjectId(req.params.id))
  if (!account) return res.status(404).send('Account not found.')
  return res.send(account)
})

router.post('/create', async (req, res) => {
  const error = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const account = new Account({
    customerId: req.body.customerId,
    type: req.body.type,
    balance: req.body.balance ? req.body.balance : 0
  })

  await account.save()
  return res.send(account)
})

function validate(body: object) {
  const schema = {
    customerId: joiObjectId().required(),
    type: Joi.string()
      .valid(['Conta Corrente', 'Conta Poupança'])
      .required(),
    balance: Joi.number()
  }

  const { error } = Joi.validate(body, schema)
  return error
}

export { router }
