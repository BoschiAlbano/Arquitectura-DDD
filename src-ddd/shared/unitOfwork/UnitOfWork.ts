import { DataSource, EntityManager, ObjectType, QueryRunner } from "typeorm";
import { IUnitOfWork } from "./IUnitOfWork";
import { IRepositorioGenerico } from "../repositories/IRepositorio.Generico";
import { TypeormRepositorio } from "../../agenda/3-infraestructura/repository/typeorm.Repositorio";
import { TypeormRepositorio as TypeormRepositorioUsuario } from "../../usuario/3-infraestructura/repository/typeorm.Repositorio";
import { Agenda } from "../../agenda/1-dominio/Agenda.entidad";
import { IUsuarioRepositorio } from "../../usuario/1-dominio/IRepositorio";
import { Usuario } from "../../usuario/1-dominio/Usuario.entidad";

export class UnitOfWork implements IUnitOfWork {
    private queryRunner: QueryRunner | null;
    private transactionManager: EntityManager | null;
    private dataSource: DataSource;

    constructor({ dataSource }: { dataSource: DataSource }) {
        this.dataSource = dataSource;
    }

    private async ensureQueryRunner(): Promise<void> {
        if (!this.queryRunner) {
            this.queryRunner = this.dataSource.createQueryRunner();
            await this.queryRunner.connect();
            this.transactionManager = this.queryRunner.manager;
        }
    }

    public async GetRepository<T>(
        entity: ObjectType<T>
    ): Promise<IRepositorioGenerico<T>> {
        try {
            await this.ensureQueryRunner();

            if (!this.queryRunner!.isTransactionActive) {
                throw new Error("No active Transaction");
            }
            const repo = this.transactionManager!.getRepository(entity);

            // deberia tener un repositorio generico 🤔
            if (typeof entity === typeof Agenda) {
                // usar contenedor de inyeccion de dependencias awilix
                return new TypeormRepositorio(repo) as IRepositorioGenerico<T>;
            }

            throw new Error("Repository not found");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async GetRepositoryUsuario(): Promise<IUsuarioRepositorio> {
        try {
            await this.ensureQueryRunner();

            if (!this.queryRunner!.isTransactionActive) {
                throw new Error("No active Transaction");
            }

            const repo = this.transactionManager!.getRepository(Usuario);

            return new TypeormRepositorioUsuario(repo) as IUsuarioRepositorio;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async BeginTransaction(): Promise<void> {
        await this.ensureQueryRunner();
        await this.queryRunner!.startTransaction();
    }

    async Commit(): Promise<void> {
        await this.queryRunner!.commitTransaction();
        await this.Release();
    }
    async Rollback(): Promise<void> {
        await this.queryRunner!.rollbackTransaction();
        await this.Release();
    }

    async Release(): Promise<void> {
        if (this.queryRunner) {
            await this.queryRunner.release();
            this.queryRunner = null;
            this.transactionManager = null;
        }
    }
}
