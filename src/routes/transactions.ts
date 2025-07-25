import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"


export async function transactionsRoutes(app: FastifyInstance) {  //todao puglin do fastify precisa de uma função async
    //vai puxar as informaçoes do banco de dados
    app.get('/', async (request, reply) => {
        const sessionId = request.cookies.sessionId

        if (!sessionId) {
            return reply.status(401).send({
                error: 'Unauthorized.',
            })
        }

        const transactions = await knex('transactions')
        .where('session_id', sessionId) //vai pegar as informaçoes do banco onde o session_id for igual ao sessionId
        .select()
        //vai retornar as informaçoes do banco de dados

        return { transactions }
    })

    app.get('/:id', async (request) => { //nesse Get vamos colocar o id do usuario na rota do insomnia para informacoes das transacoes
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params)

        const transaction = await knex('transactions').where('id', id).first()

        return {
            transaction,
        }
    })

    app.get('/summary', async () => {
        const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()

        return summary
    })

    app
        .post('/', async (request, reply) => {
            //vai puxar a informacáo do body como titulo, valor e tipo
            const createTransactionBodySchema = z.object({
                title: z.string(),
                amount: z.number(),
                type: z.enum(['credit', 'debit']),
            })

            const { title, amount, type } = createTransactionBodySchema.
                parse(request.body)

            let sessionId = request.cookies.sessionId

            if (!sessionId) {
                sessionId = randomUUID() //se nao tiver o sessionId, vai criar um novo, para o usuario e vai consumir a informacoes primaria do usuario
                reply.cookie(sessionId, sessionId, {
                    path: '/', //cookie vai ser valido para toda a aplicaçao
                    maxAge: 60 * 60 * 24 * 7, // informando quantos dias o cookie vai esta sendo validado, apos esses dias, sera apagado
                })
            }

            await knex('transactions').insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId
            })

            return reply.status(201).send
        })
}