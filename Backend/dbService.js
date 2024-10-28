const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config(); // Load environment variables from .env file

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        return;
    }
    console.log('Connected to the MySQL server.');
});

let instance = null; // Declare the instance variable to keep the singleton instance

class DbService {
    static getDbServiceInstance() {
        if (!instance) {
            instance = new DbService(); // Only create a new instance if it doesn't already exist
        }
        return instance;
    }

    async createUser({ username, password, firstname, lastname, salary, age, registerday, signintime }) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
                connection.query(query, [username, password, firstname, lastname, salary, age, registerday, signintime], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.insertId);
                });
            });
            return {
                id: response,
                username,
                password,
                firstname,
                lastname,
                salary,
                age,
                registerday,
                signintime
            };
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async getAllUsers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async updateUserById(username, { firstname, lastname, salary, age }) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Users SET firstname = ?, lastname = ?, salary = ?, age = ? WHERE username = ?;";
                connection.query(query, [firstname, lastname, salary, age, username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows);
                });
            });
            return response === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async deleteUserById(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Users WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows);
                });
            });
            return response === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async verifyUserCredentials(username, password) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "SELECT password FROM Users WHERE username = ?";
            connection.query(query, [username], (err, results) => {
              if (err) reject(new Error(err.message));
              if (results.length > 0) {
                const storedPassword = results[0].password;
                // Direct comparison since passwords are stored in plain text
                resolve(password === storedPassword);
              } else {
                resolve(false); // No user found
              }
            });
          });
          return response;
        } catch (error) {
          console.error(error);
          console.log("Checking credentials for:", username, password);
          return false;
        }
      }
      
    async registerUser(username, password, firstname, lastname, salary, age) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = `
              INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime)
              VALUES (?, ?, ?, ?, ?, ?, NOW(), NULL)
            `;
            connection.query(query, [username, password, firstname, lastname, salary, age], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.affectedRows > 0);
            });
          });
          return response;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
    
      
    async updateLastSignIn(username) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = "UPDATE Users SET signintime = NOW() WHERE username = ?";
            connection.query(query, [username], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.affectedRows > 0);
            });
          });
          return response;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
        
      
}


module.exports = DbService;
