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
        firstName,
        lastName,
        birthDate,
        nationalId,
        email,
        phoneNumber,
        position
    } = req.body;
    const user = {
        employee_id,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        national_id: nationalId,
        position,
        email,
        phone_number: phoneNumber
    };
    const now = Date.now();
    const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 21))
    const schema = joi.object().keys({
        employee_id: joi
            .number()
            .integer()
            .required(),
        first_name: joi
            .string()
            .regex(/^[a-zA-Z0-9\s]{2,25}$/)
            .trim(),
        last_name: joi
            .string()
            .trim()
            .regex(/^[a-zA-Z0-9\s]{2,25}$/),
        email: joi
            .string()
            .email()
            .trim(),
        phone_number: joi
            .string()
            .trim()
            .regex(new RegExp("^[0-9]{10}$")),
        national_id: joi
            .string()
            .trim()
            .regex(new RegExp("^[0-9]{16}$")),
        position: joi
            .string()
            .trim(),
        birth_date: joi
            .date()
            .max(cutoffDate)
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
