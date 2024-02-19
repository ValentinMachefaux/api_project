import mysql from "mysql"

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_project',
    port: 3306
});
