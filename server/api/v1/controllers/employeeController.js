import { Pool } from 'pg'
import responseMsg from '../helpers/responseMsg'
import checkInt from '../helpers/checkInt'
import sendEmail from '../helpers/sendEmail'


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
export default class EmployeeController {
    /**
    * @description This helps the authorized Manager to fetch all employees or search by first_name, last_name, email, position or phone_number
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async index(req, res) {
        try {
            const search = req.query.search
            if (search) {
                const text = `SELECT * FROM employees WHERE first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%' OR position LIKE '%${search}%' OR phone_number LIKE '%${search}%'`
                const { rows } = await pool.query(text)

                responseMsg.successDataMsg(res, 200, rows)
            } else {
                const text = `SELECT * FROM employees`
                const { rows } = await pool.query(text)

                responseMsg.successDataMsg(res, 200, rows)
            }
        } catch (error) {
            responseMsg.errorMsg(res, 500, error)
        }
    }
    /**
    * @description This helps the authorized Manager to create a new employee
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async create(req, res) {
        const value = req.value
        const token = res.token
        const text = ('INSERT INTO employees(email, first_name, last_name, phone_number, national_id, position, status, birth_date, manager_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *')
        const values = [value.email, value.first_name, value.last_name, value.phone_number, value.national_id, value.position, value.status, value.birth_date, token.id]
        try {
            const { rows } = await pool.query(text, values);
            sendEmail(rows[0].email, rows[0].first_name,'an accoutnt at your name was created our api teamwork')
            responseMsg.successDataMsg(res, 201, rows[0])
            
        } catch (error) {
            if (error && error.routine === '_bt_check_unique') return responseMsg.errorMsg(res, 403, 'Email, National id or Phone number provided exist already')
        }
        
    }
    /**
    * @description This helps the authorized Manager to update an existing employee information location
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async edit(req, res) {
        const value = req.value
        const updateOne = `UPDATE employees SET first_name=$1, last_name=$2, birth_date=$3, national_id=$4, position=$5, email=$6, phone_number=$7
                            WHERE id=($8) returning *`
        const fetch_text = 'SELECT * FROM employees WHERE id = $1'

        const { rows } = await pool.query(fetch_text, [value.employee_id])
        if (!rows[0]) return responseMsg.errorMsg(res, 404, 'employee not found')
        
        const newUser = [
            value.first_name ? value.first_name :rows[0].first_name,
            value.last_name ? value.last_name :rows[0].last_name ,
            value.birth_date ? value.birth_date :rows[0].birth_date ,
            value.national_id ? value.national_id :rows[0].national_id ,
            value.position ? value.position :rows[0].position,
            value.email ? value.email :rows[0].email ,
            value.phone_number ? value.phone_number :rows[0].phone_number,
            value.employee_id
        ]

        const response = await pool.query(updateOne, await newUser);
        responseMsg.successDataMsg(res, 200, response.rows[0])
    }
    /**
    * @description This helps the authorized Manager to update an existing employee status
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async activate(req, res) {
        const value = req.value
        const updateOne = `UPDATE employees SET status=($2) where id=($1) returning *`
        const {rows} = await pool.query(updateOne, [value.employee_id, value.status])
        if (rows.length == 0) return responseMsg.errorMsg(res, 404, 'employee not found')
        
        responseMsg.successDataMsg(res, 200, rows[0])
    }
    /**
    * @description This helps the authorized Manager to suspend an existing employee status
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async suspend(req, res) {
        const value = req.value
        const updateOne = `UPDATE employees SET status=($2) where id=($1) returning *`
        const { rows } = await pool.query(updateOne, [value.employee_id, value.status])
        if (rows.length == 0) return responseMsg.errorMsg(res, 404, 'employee not found')
        
        responseMsg.successDataMsg(res, 200, rows[0])
    }
    /**
    * @description This helps the authorized Manager to delete an employee
    * @param  {object} req - The request object
    * @param  {object} res - The response object
    */
    static async delete(req, res) {
        const { employee_id } = req.params
        const token = res.token

        if (token.status !== 'active' && token.position !== 'manager') responseMsg.errorMsg(res, 400, 'you have no rights to assign employees')
        if (!checkInt(employee_id)) return responseMsg.errorMsg(res, 403, 'employee must be an integer and less than 8 in length')

        const deleteOne = `DELETE FROM employees WHERE id=($1) returning *`

        const {rows} = await pool.query(deleteOne, [employee_id]);
        if (rows.length == 0) return responseMsg.errorMsg(res, 404, 'employee not found')
        
        responseMsg.successDataMsg(res, 200, rows[0])
    }
}