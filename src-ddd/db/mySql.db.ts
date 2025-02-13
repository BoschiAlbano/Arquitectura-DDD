import mysql from "mysql2/promise";

const dbConfing = {
    host: "localhost",
    port: 3306,
    database: process.env.database || "",
    user: process.env.user || "",
    password: process.env.password || "",
};

export const pool = mysql.createPool(dbConfing);
