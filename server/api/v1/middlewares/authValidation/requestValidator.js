import joi from "joi"
import responseMsg from '../../helpers/responseMsg'

export default (req, res, next) => {
    const { email, newPassword } = req.body
    const user = { email, password: newPassword }
    const schema = joi.object().keys({

        email: joi
            .string()
            .email()
            .trim()
            .required(),
        password: joi
            .string()
            .regex(new RegExp("^[a-zA-Z0-9]{8,32}$"))
            .required(),

    });
    const { error, value } = joi.validate(user, schema);

    if (error) {

        responseMsg.errorMsg(res, 400, error.details[0].message)
    } else {
        req.value = value;
        next();
    }
};