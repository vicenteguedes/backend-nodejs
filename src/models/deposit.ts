import { createSchema, Type, typedModel } from 'ts-mongoose'

const depositSchema = createSchema({
  accountId: Type.string({ required: true }),
  amount: Type.number({ required: true }),
  date: Type.date({ default: Date.now })
})

const Deposit = typedModel('Deposit', depositSchema)

export { Deposit }
