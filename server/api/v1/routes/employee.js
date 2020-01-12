import express from 'express'
import employeeController from '../controllers/employeeController'
import authanticationJWT from "../middlewares/authJWT"
import createEmployeeValidator from "../middlewares/employeeValidation/createEmployeeValidator"
import employeeEditValidator from "../middlewares/employeeValidation/editEmployee"
// import commentRedFlagValidator from "../middlewares/redFlagValidation/commentRedFlagValidator"


const router = express.Router();
router.post("/", authanticationJWT, createEmployeeValidator, employeeController.create)
router.patch("/:employee_id", authanticationJWT, employeeEditValidator, employeeController.edit)
// router.patch("/:red_flag_id/comment", authanticationJWT, commentRedFlagValidator, redFlagController.updateComment)
// router.get("/:red_flag_id", authanticationJWT, redFlagController.getOne)
// router.get("/", authanticationJWT, redFlagController.getAll)
// router.delete("/:red_flag_id", authanticationJWT, redFlagController.delete)

export default router;