create database IF NOT EXISTS user_db;
use user_db;
CREATE TABLE IF NOT EXISTS user (
   id integer PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    access_token VARCHAR(100) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    INDEX (email),
    INDEX (access_token)
);