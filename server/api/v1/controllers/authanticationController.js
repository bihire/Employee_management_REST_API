import jwt from 'jsonwebtoken'
import { Pool } from 'pg'
import hashPassword from '../helpers/hash'
import sendEmail from '../helpers/sendEmail'
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
            const values = [value.email, value.first_name, value.last_name, value.password, value.phone_number, value.national_id, value.position, 'active', value.birth_date]

            const { rows } = await pool.query(text, values)
            sendEmail(rows[0].email, 'an accoutnt at your name was created our api teamwork cluick to activate it')
            res.status(201).send({
                status: 201,
                message: "User created successfully",
                data: { manager: rows[0] }
            });
        } catch (error) {
            if (error && error.routine === '_bt_check_unique') return res.status(403).json({
                status: 403,
                error: 'Email provided exist already'
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

};
