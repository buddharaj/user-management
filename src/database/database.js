// import { pool } from "./connection.database.js"
import mysql from 'mysql2'
import dotenv from 'dotenv'
import { prepareUserQuery } from './user.js'
dotenv.config()
const pool = mysql.createPool({
  connectionLimit:4,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})
const USER_TABLE_NAME = 'user'

export const checkUserById = async (userId) => {
    const connection = await pool.promise().getConnection()
    const [result] = await connection.query(
        `SELECT count(1) AS rowCount 
        FROM ${USER_TABLE_NAME} 
        WHERE id = ?`,
        [userId]
    )
    connection.release()
    return result[0]
}

export const checkUserByEmail =  async(email) => {
    const connection = await pool.promise().getConnection()
    const [result] = await connection.query(
        `SELECT count(1) AS rowCount 
        FROM ${USER_TABLE_NAME} 
        WHERE email = ?`,
        [email]
    )
    connection.release()
    return result[0]
}

export const getUserByEmail =  async(email) => {
    const connection = await pool.promise().getConnection()
    const [ result] = await connection.query(
        `SELECT *
        FROM ${USER_TABLE_NAME} 
        WHERE email = ?`,
        [email]
    )
    connection.release()
    return result
}

export const getUserById =  async(id) => {
    const connection = await pool.promise().getConnection()
    const [ result] = await connection.query(
        `SELECT id, name, email, role
        FROM ${USER_TABLE_NAME} 
        WHERE id = ?`,
        [id]
    )
    connection.release()
    return result
}

export const deleteUserById =  async(id) => {
    const connection = await pool.promise().getConnection()
    const [ result] = await connection.query(
        `DELETE 
        FROM ${USER_TABLE_NAME} 
        WHERE id = ?`,
        [id]
    )
    connection.release()
    return result
}

export const getUserAll =  async() => {
    const connection = await pool.promise().getConnection()
    const [ result] = await connection.query(
        `SELECT id, name, email, role
        FROM ${USER_TABLE_NAME}`
    )
    connection.release()
    return result
}

export const createUser = async(name, email, password, role, access_token) => {
    const connection = await pool.promise().getConnection()
    const [ result ] = await connection.query(
        `INSERT INTO ${USER_TABLE_NAME} (name, email, password, role, access_token)
        VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, role, access_token]
    )
    connection.release()
    return result
}

export const updateUser = async(name, email, password, role, userId) => {
    const connection = await pool.promise().getConnection()
    const prepareStatement = prepareUserQuery(name, email, password, role, userId)
    const [ result ] = await connection.query(
        prepareStatement.query,
        prepareStatement.values
    )
    connection.release()
    return result
}