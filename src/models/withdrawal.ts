import { createSchema, Type, typedModel } from 'ts-mongoose'

const withdrawalSchema = createSchema({
  accountId: Type.string({ required: true }),
  amount: Type.number({ required: true }),
  date: Type.date({ default: Date.now })
})

const Withdrawal = typedModel('Withdrawal', withdrawalSchema)

export { Withdrawal }
