import responseMsg from '../../helpers/responseMsg'


import joi from "joi"
export default (req, res, next) => {
    const {
        firstName,
        lastName,
        birthDate,
        nationalId,
        email,
        password,
        phoneNumber,
        confirmPassword
    } = req.body;
    const user = {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        national_id: nationalId,
        email,
        phone_number: phoneNumber,
        password,
        confirm_password: confirmPassword
    };
    const now = Date.now();
    const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 21));
    const pattern = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
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
        password: joi
            .string()
            .regex(new RegExp("^[a-zA-Z0-9]{8,32}$"))
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
            .default('manager'),
        birth_date: joi
            .date()
            .max(cutoffDate)
            .required(),

        confirm_password: joi
            .string()
            .required()
            .valid(joi.ref("password"))
    });
    const { error, value } = joi.validate(user, schema)

    if (error) {
        error.details[0].context.key == 'birth_date' ?responseMsg.errorMsg(res, 400, 'birthDate must have format of yyyy-mm-dd and age must be above 18'):
        responseMsg.errorMsg(res, 400, error.details[0].message)
    } else {

        delete value.confirm_password
        req.value = value;
        next();
    }
};
