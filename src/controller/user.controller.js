import { createUserSchema, loginUserSchema, updateUserSchema } from "../validate/user.validate.js";
import { validate, getErrors } from "../validate/validator.js";
import { generateToken } from "../middleware/auth.js";
import { checkPassword, getPasswordHash } from "../utils/helper.js";
import CryptoJS from "crypto-js"

/**
 * @description - create new user
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @return {object} -  user id
 */
export async function saveUser(req, res, database) {
    const userData = req.body
    if (!validate(userData, createUserSchema)) {
        return res.status(400).send(
            { 'message': `Input validation failed - ${getErrors(userData, createUserSchema)}`
        }) 
    }

    const userCount =  await database.checkUserByEmail(userData.email)
    if (userCount.rowCount) {
        return res.status(400).send( { 'message': 'User already exists'} )
    }

    const access_token = CryptoJS.SHA256(process.env.ACCESS_TOKEN_SECRET_KEY).toString(CryptoJS.enc.Hex);
    const passwordHash = await getPasswordHash(userData.password)
    const result = await database.createUser(
        userData.name,
        userData.email,
        passwordHash,
        userData.role.toUpperCase(),
        access_token
        )
    return res.status(201).send({
        id: result.insertId
    })
}

/**
 * @description - login an existing user if exists
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @returns {object} - access_token access token to request resources
 */
export async function login(req, res, database) {
    const userData = req.body
    if (!validate(userData, loginUserSchema)) {
        return res.status(400).send(
            { 'message': `Input validation failed - ${getErrors(userData, loginUserSchema)}`
        })
    }
    const result =  await database.getUserByEmail(userData.email)
    if (!result|| !result.length) {
        return res.status(400).send( { 'message': 'User does not exists'} )
    }
    const dbUser = result[0]

    //check if password is correct
    const isValidPassword = await checkPassword(userData.password, dbUser.password)
    if (!isValidPassword) {
        return res.status(400).send( { 'message': 'Wrong Password. Try again'} )
    }
    const accessToken = generateToken({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role
    })
 
    return res.status(201).send({
        access_token: accessToken
    })
}

/**
 * @description - update an existing user if exists
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @return {object} - success message
 */
export async function updateUser(req, res, database) {
    const userData = req.body
    if (!validate(userData, updateUserSchema)) {
        return res.status(400).send(
            { 'message': `Input validation failed - ${getErrors(userData, loginUserSchema)}`
        })
    }
    const userId = req.params.userId;
    const userCount =  await database.checkUserById(userId)
    if (!userCount.rowCount) {
        return res.status(400).send( { 'message': 'User does not exists'})
    }
    await database.updateUser(
        userData.name,
        userData.email,
        userData.password,
        userData.role,
        userId
        )
    return res.status(200).send({'message': 'Updated Successfully' })
}

/**
 * @description - get an existing user if exists
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @return {object} - user details
 */
export async function getUser(req, res, database) {
    const userId = req.params.userId
    if (!userId) {
        return res.status(300).send({ 'message': 'Bad request'})
    }
    if (req.userId) {
        return res.status(300).send({ 'message': 'Bad request'})
    }
    
    const result =  await database.getUserById(userId)
    if (!result|| !result.length) {
        return res.status(400).send( { 'message': 'User does not exists'} )
    }
    return res.status(200).send(result[0])
}

/**
 * @description - get all users
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @return {object} - list of user details
 */
export async function getUserAll(req, res, database) {
    return res.status(200).send(await database.getUserAll())
}

/**
 * @description - get all users
 * @param {object} req - user request input
 * @param {object} res - response
 * @param {object} database - database client
 * @return {object} - success message object
 */
export async function deleteUser(req, res, database) {
    const userId = req.params.userId
    if (!userId) {
        return res.status(300).send({ 'message': 'Bad request'})
    }
    const userCount =  await database.checkUserById(userId)
    if (!userCount.rowCount) {
        return res.status(400).send( { 'message': 'User does not exists'})
    }
    
    await database.deleteUserById(userId)
    return res.status(200).send({ 'message': 'User deleted successfully.'} )
}