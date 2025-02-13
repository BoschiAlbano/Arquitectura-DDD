import { Pool, PoolConnection } from "mysql2/promise";
import { IRepositorioGenerico } from "../repositories/IRepositorio.Generico";
import { IUnitOfWork } from "./IUnitOfWork";
import { MySqlRepositorio } from "../../agenda/3-infraestructura/repository/mySql.Repositorio";

export class UnitOfWork implements IUnitOfWork {
    private pool: Pool;
    private connection: PoolConnection | null = null;

    constructor({ pool }: { pool: Pool }) {
        this.pool = pool;
    }

    async BeginTransaction(): Promise<void> {
        try {
            this.connection = await this.pool.getConnection();
            await this.connection.beginTransaction();
        } catch (error) {
            console.log("UnitOfWork");
            console.log(error);
            throw error;
        }
    }
    async Commit(): Promise<void> {
        if (!this.connection) {
            throw new Error("No active Transaction");
        }

        try {
            await this.connection.commit();
        } finally {
            this.connection.release();
            this.connection = null;
        }
    }

    async Rollback(): Promise<void> {
        if (!this.connection) {
            throw new Error("No active Transaction");
        }

        try {
            await this.connection.rollback();
        } finally {
            this.connection.release();
            this.connection = null;
        }
    }

    async Close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
        }
    }

    GetRepository<T>(entidad: string): IRepositorioGenerico<T> {
        try {
            if (entidad === "agendaRepositorio") {
                if (!this.connection) {
                    throw new Error("No active connction for repository");
                }

                return new MySqlRepositorio({
                    pool: this.connection,
                }) as IRepositorioGenerico<T>;
            }
            throw new Error("Repository not found");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
