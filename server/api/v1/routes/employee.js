import express from 'express'
import employeeController from '../controllers/employeeController'
import authanticationJWT from "../middlewares/authJWT"
import createEmployeeValidator from "../middlewares/employeeValidation/createEmployeeValidator"
import employeeEditValidator from "../middlewares/employeeValidation/editEmployee"
import activateEmployeeValidator from "../middlewares/employeeValidation/activateEmployeeValidator"
import suspendEmployeeValidator from "../middlewares/employeeValidation/suspendEmployeeValidator"


const router = express.Router();
router.post("/", authanticationJWT, createEmployeeValidator, employeeController.create)
router.patch("/:employee_id", authanticationJWT, employeeEditValidator, employeeController.edit)
router.patch("/:employee_id/activate", authanticationJWT, activateEmployeeValidator, employeeController.activate)
router.patch("/:employee_id/suspend", authanticationJWT, suspendEmployeeValidator, employeeController.suspend)
router.get("/", authanticationJWT, employeeController.index)
router.delete("/:employee_id", authanticationJWT, employeeController.delete)

export default router;