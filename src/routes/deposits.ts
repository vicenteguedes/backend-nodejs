import * as express from 'express'
import * as Joi from 'joi'
import * as JoiObjectId from 'joi-objectid'
const joiObjectId = JoiObjectId(Joi)
import * as mongoose from 'mongoose'
import { Account } from '../models/account'
import { Deposit } from '../models/deposit'

const router = express()

router.get('/', async (req, res) => {
  const deposits = await Deposit.find()
  return res.send(deposits)
})

router.post('/', async (req, res) => {
  const error = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const account = await Account.findById(mongoose.Types.ObjectId(req.body.accountId))
  if (!account) return res.status(404).send('Account not found.')

  account.balance += req.body.amount
  await account.save()

  await Deposit.create({
    accountId: account._id,
    amount: req.body.amount
  })

  return res.send(account)
})

function validate(body: object) {
  const schema = {
    accountId: joiObjectId().required(),
    amount: Joi.number().required()
  }

  const { error } = Joi.validate(body, schema)
  return error
}

export { router }
