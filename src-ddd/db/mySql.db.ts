import mysql from "mysql2/promise";

const dbConfing = {
    host: "localhost",
    port: 3306,
    database: process.env.database || "",
    user: process.env.user || "",
    password: process.env.password || "",
};

// async function connect() {
//     const connection = await mysql.createConnection(dbConfing);
//     return connection;
// }

// export { connect };

export const pool = mysql.createPool(dbConfing);
