import * as express from "express";
import * as Joi from "joi";
import { accounts } from "./account";

const router = express();

router.post("/", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const account = accounts.find(a => a.id === req.body.accountId);
  if (!account) return res.status(404).send("Account not found.");

  if (account.balance >= req.body.amount + 0.3) {
    account.balance -= req.body.amount + 0.3;
    account.balance = Math.round(account.balance * 100) / 100;
    return res.send(account);
  } else {
    return res
      .status(400)
      .send(
        "Amount plus the B$ 0,30 fee must be less than or equal to the account balance."
      );
  }
});

function validate(body: object) {
  const schema = {
    accountId: Joi.string().required(),
    amount: Joi.number()
      .max(600)
      .required()
  };

  const { error } = Joi.validate(body, schema);
  return error;
}

export { router };
