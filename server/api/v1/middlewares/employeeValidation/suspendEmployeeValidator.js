import responseMsg from '../../helpers/responseMsg'
import checkInt from "../../helpers/checkInt";


import joi from "joi"
export default (req, res, next) => {
    const token = res.token
    const { employee_id } = req.params;

    if (token.status !== 'active' && token.position !== 'manager') responseMsg.errorMsg(res, 400, 'you have no rights to assign employees')

    if (!checkInt(employee_id)) {
        responseMsg.errorMsg(
            res,
            400,
            "red-flag-id must be an integer and less than 8 in length"
        );
    }
    const {
        status
    } = req.body;
    const user = {
        employee_id,
        status
    };

    const schema = joi.object().keys({
        employee_id: joi
            .number()
            .integer()
            .required(),
        status: joi
            .string()
            .valid('suspended')
            .required(),

    });
    const { error, value } = joi.validate(user, schema)

    if (error) {
        error.details[0].context.key == 'birth_date' ? responseMsg.errorMsg(res, 400, 'birthDate must have format of yyyy-mm-dd and age must be above 18') :
            responseMsg.errorMsg(res, 400, error.details[0].message)
    } else {
        req.value = value
        next();
    }
};
