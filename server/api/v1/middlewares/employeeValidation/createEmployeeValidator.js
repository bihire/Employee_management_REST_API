import responseMsg from '../../helpers/responseMsg'


import joi from "joi"
export default (req, res, next) => {
    if (token.status !== 'active' && token.position !== 'manager') responseMsg.errorMsg(res, 400, 'you have no rights to assign employees')

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
        first_name: joi
            .string()
            .regex(/^[a-zA-Z0-9\s]{2,25}$/)
            .trim()
            .required(),
        last_name: joi
            .string()
            .trim()
            .regex(/^[a-zA-Z0-9\s]{2,25}$/)
            .required(),
        email: joi
            .string()
            .email()
            .trim()
            .required(),
        phone_number: joi
            .string()
            .trim()
            .regex(new RegExp("^[0-9]{10}$"))
            .required(),
        national_id: joi
            .string()
            .trim()
            .regex(new RegExp("^[0-9]{16}$"))
            .required(),
        status: joi
            .string()
            .trim()
            .default('inactive'),
        position: joi
            .string()
            .trim()
            .required(),
        birth_date: joi
            .date()
            .max(cutoffDate)
            .required()
    });
    const { error, value } = joi.validate(user, schema)

    if (error) {
        error.details[0].context.key == 'birth_date' ? responseMsg.errorMsg(res, 400, 'birthDate must have format of yyyy-mm-dd and age must be above 18') :
            responseMsg.errorMsg(res, 400, error.details[0].message)
    } else {

        req.value = value
        console.log(value)
        next();
    }
};
