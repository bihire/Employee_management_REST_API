import jwt from 'jsonwebtoken'
import { Pool } from 'pg'
import hashPassword from '../helpers/hash'
import sendEmail from '../helpers/sendEmail'
import responseMsg from '../helpers/responseMsg'
import comparePassword from '../helpers/compareHash'
import dotenv from 'dotenv'
dotenv.config()


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default class AuthanticationController {
    /**
     * @description This helps a new Manager to create credentials
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     */
    static async register(req, res) {
        try {
            const value = await req.value;
            value.password = await hashPassword(value.password)
            const text = ('INSERT INTO managers(email, first_name, last_name,password, phone_number, national_id, position, status, birth_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *')
            const values = [value.email, value.first_name, value.last_name, value.password, value.phone_number, value.national_id, value.position, value.status, value.birth_date]

            const { rows } = await pool.query(text, values)
            const newValue = {
                id: rows[0].id,
                status: rows[0].status,
                position: rows[0].position
            }
            const token = jwt.sign(newValue, process.env.SECRET)
            const url = `https://employeeman.herokuapp.com/api/v1/auth/confirm/${token}`
            sendEmail(rows[0].email, rows[0].first_name, `<p>Please click on the following link to confirm your email:</br><a href="${url}">${url}</a></p>`)
            responseMsg.successMsg(res, 201, 'Check your email to activate your account')
        } catch (error) {
            if (error && error.routine === '_bt_check_unique') return res.status(403).json({
                status: 403,
                error: 'Email, National id or Phone number provided exist already'
            })
            return res.status(500).json({
                status: 500,
                error: error
            })
        }


    }
    /**
   * @description This checks if it is a registered Manager and returns a token as a response
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   */
    static async login(req, res) {
        const value = req.value;
        const fetch_text = 'SELECT * FROM managers WHERE email = $1'
        const values = [value.email]

        const { rows } = await pool.query(fetch_text, values)
        if (!rows[0]) {
            return res.status(403).json({
                status: 403,
                message: 'invalid email or password'
            });
        }
        const User = rows[0]
        if (User.status === 'inactive') {
            return res.status(401).json({
                status: 401,
                message: 'check your email to activate your account'
            });
        }
        const isUser = await comparePassword({ value, User })
        if (isUser) {
            const newValue = {
                id: User.id,
                status: User.status,
                position: User.position
            }
            const token = jwt.sign(newValue, process.env.SECRET)
            res.status(200).json({
                status: 200,
                message: 'User is successfully logged in',
                data: { token: token }
            })
        } else {
            res.status(403).json({ status: 403, error: 'invalid email or password' });
        }
    }
    /**
     * @description This helps a new Manager to confirm their credentials after signup
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     */
    static async confirm(req, res) {
        try {
            const token = res.token
            const updateOne = `UPDATE managers SET status=($2) where id=($1) returning *`
            const { rows } = await pool.query(updateOne, [token.id, 'active'])
            if (rows.length == 0) responseMsg.errorMsg(res, 404, 'Manager not found')

            responseMsg.successMsg(res, 200, 'Your Email was confirmed you can login now')
        } catch (error) {
            responseMsg.errorMsg(res, 500, error)
        }


    }
    /**
     * @description This helps a new Manager to request reset of their password of their credentials
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     */
    static async requestReset(req, res) {
        try {
            const value = req.value
            const fetch_text = "SELECT * FROM managers WHERE email=$1";

            const { rows } = await pool.query(fetch_text, [value.email]);
            if (rows.length == 0) return responseMsg.errorMsg(res, 404, 'Manager not found')
            if (rows[0].status == 'inactive') return responseMsg.errorMsg(res, 401, 'Please activate your account first')

            value.password = await hashPassword(value.password)
            const newValue = {
                id: rows[0].id,
                status: rows[0].status,
                position: rows[0].position,
                password: value.password
            }
            const token = jwt.sign(newValue, process.env.SECRET)
            const url = `https://employeeman.herokuapp.com/api/v1/auth/reset/confirm/${token}`
            sendEmail(rows[0].email, rows[0].first_name, `<p>Please click on the following link to confirm your new password or ignore if you did not perform the action:</br><a href="${url}">${url}</a></p>`)

            responseMsg.successMsg(res, 200, 'check your email for password reset')
        } catch (error) {
            responseMsg.errorMsg(res, 500, error)
        }


    }
    /**
     * @description This helps a Manager to confirm reset of their password of their credentials
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     */
    static async resetConfirm(req, res) {
        try {
            const token = res.token
            const updateOne = `UPDATE managers SET password=($2) where id=($1) returning *`
            const { rows } = await pool.query(updateOne, [token.id, token.password])
            if (rows.length == 0) responseMsg.errorMsg(res, 404, 'Manager not found')

            responseMsg.successMsg(res, 200, 'Your Password was reset you can login with new credintials now')
        } catch (error) {
            responseMsg.errorMsg(res, 500, error)
        }
    }

};
