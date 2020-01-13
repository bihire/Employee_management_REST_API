import express from 'express'
import AuthanticationController from '../controllers/authanticationController'
import signupValidator from "../middlewares/authValidation/signupValidator"
import signinValidator from "../middlewares/authValidation/signinValidator"
import requestValidator from "../middlewares/authValidation/requestValidator"
import authanticationJWT from "../middlewares/authJWT"

const router = express.Router();
router.post("/signup", signupValidator, AuthanticationController.register)
router.post("/signin", signinValidator, AuthanticationController.login)
router.use("/confirm/:email_token", authanticationJWT, AuthanticationController.confirm)
router.post("/reset/request", requestValidator, AuthanticationController.requestReset)
router.use("/reset/confirm/:email_token", authanticationJWT, AuthanticationController.resetConfirm)

export default router;
