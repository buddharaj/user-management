import bcrypt from "bcryptjs";

export const getPasswordHash = async (password) => await bcrypt.hash(password, 10)

export const checkPassword = async (password, passwordHash) => await bcrypt.compare(password, passwordHash)
