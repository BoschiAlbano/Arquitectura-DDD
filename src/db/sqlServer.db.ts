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

export async function getConnection() {
    try {
        const pool = await sql.connect(dbConfing);
        return pool;
        // const result = await pool.request().query("SELECT 1");
        // console.log(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export { sql };
