import * as express from 'express'
import * as Joi from 'joi'
import * as JoiObjectId from 'joi-objectid'
const joiObjectId = JoiObjectId(Joi)
import * as mongoose from 'mongoose'
import { Account } from '../models/account'
import { Withdrawal } from '../models/withdrawal'

const router = express()

router.get('/', async (req, res) => {
  const withdrawals = await Withdrawal.find()
  return res.send(withdrawals)
})

router.post('/', async (req, res) => {
  const error = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const account = await Account.findById(mongoose.Types.ObjectId(req.body.accountId))
  if (!account) return res.status(404).send('Account not found.')

  if (account.balance >= req.body.amount + 0.3) {
    account.balance -= req.body.amount + 0.3
    account.balance = Math.round(account.balance * 100) / 100
    await account.save()

    await Withdrawal.create({
      accountId: account._id,
      amount: req.body.amount
    })

    return res.send(account)
  } else {
    return res.status(400).send('Amount plus the B$ 0,30 fee must be less than or equal to the account balance.')
  }
})

function validate(body: object) {
  const schema = {
    accountId: joiObjectId().required(),
    amount: Joi.number()
      .max(600)
      .required()
  }

  const { error } = Joi.validate(body, schema)
  return error
}

export { router }
