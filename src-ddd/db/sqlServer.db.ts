import sql from "mssql";

const dbConfing = {
    user: process.env.user || "",
    password: process.env.password || "",
    server: process.env.server || "",
    database: process.env.database || "",
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true,
    },
};

class SqlServerConnection {
    private static _instance: SqlServerConnection;
    private pool: sql.ConnectionPool;

    private constructor() {
        this.pool = new sql.ConnectionPool(dbConfing);
    }

    public static getInstance(): SqlServerConnection {
        return this._instance || (this._instance = new this());
    }

    public async getConnection() {
        try {
            await this.pool.connect();
            return this.pool;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export { sql, SqlServerConnection };

// import sql from "mssql";

// const dbConfing = {
//     user: process.env.user || "",
//     password: process.env.password || "",
//     server: process.env.server || "",
//     database: process.env.database || "",
//     options: {
//         encrypt: true, // for azure
//         trustServerCertificate: true,
//     },
// };

// export async function getConnection() {
//     try {
//         const pool = await sql.connect(dbConfing);
//         return pool;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// export { sql };
