import knex from "knex";

declare module "knex/types/tables" {
    export interface Table {
        transaction: {
            id: string,
            title: string,
            amount: number,
            created_at: string,
            session_id?: string 
        }
    }
}