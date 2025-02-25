import "reflect-metadata";
import app from "./app";

import { AppDataSource } from "./db/typeorm.db";

app.listen(app.get("port"), () => {
    try {
        console.log("server on puerto", app.get("port"));
        AppDataSource.initialize();
    } catch (error) {
        console.log("Error Start Server", error);
    }
});

// console.log("server on puerto", app.get("port"));
