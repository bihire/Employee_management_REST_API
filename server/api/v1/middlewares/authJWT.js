import jsonwebtoken from "jsonwebtoken"
import express from "express"
import dotenv from 'dotenv'
dotenv.config()

const app = express();

export default (req, res, next) => {
  const { token } = req.headers
  const { email_token } = req.params
  const newToken = email_token ?email_token :token
  if (newToken) {
    jsonwebtoken.verify(newToken, process.env.SECRET, (err, token) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          data: `failed to authanticate token: ${err}`
        });
      }
      res.token = token;
      next();
    });
  } else {
    res.status(401).json({
      status: 401,
      data: "please provide token"
    });
  }
};
