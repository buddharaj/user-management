export const createUserTable = async (connection) => {
  let createUserTable = `create table if not exists user(
      id int primary key auto_increment,
      name varchar(50)not null,
      email varchar(50) not null default 0
    )`;
    return connection.query(createUserTable)
}

// CREATE TABLE user (
//   id integer PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(50) NOT NULL,
//   email VARCHAR(50) NOT NULL,
//   password VARCHAR(50) NOT NULL,
//   role VARCHAR(10) NOT NULL,
//   access_token TEXT NOT NULL,
//   created TIMESTAMP NOT NULL DEFAULT NOW()
// );

export const prepareUserQuery = (name, email, password, role, userId) => {
  let query = `UPDATE user SET `
  const values = []
  if (name) {
      query += ' name = ?'
      values.push(name)
  }
  if (email) {
      values.length ? query += ', email = ?' : query += ' email = ?'
      values.push(email)
  }
  if (password) {
      values.length ? query += ', password = ?' : query += ' password = ?'
      values.push(password)
  }
  if (role) {
      values.length ? query += ', role = ?' : query += ' role = ?'
      values.push(role.toUppercase())
  }
  query += ' WHERE id = ?'
  values.push(userId)
  return {
      query,
      values
  }
}