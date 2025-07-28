import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../midllewares/check-session-id-exist"



export async function transactionsRoutes(app: FastifyInstance) { 
     //todao puglin do fastify precisa de uma função async
    //vai puxar as informaçoes do banco de dados
    app.addHook('preHandler', async (request, reoly) => {
        console.log(`[${ request.method}] ${request.url}`)
    }) // addHook ele nao precisa de um return, ele nao vai chamar as demais rotas, a nao ser a transactions..
    //caso queira que ele chame em todas as rotas Globais, e preciso levar o addHook para o modulo server.ts 
    app.get(
        '/',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies //vai pegar o sessionId do cookie



            const transactions = await knex('transactions')
                .where('session_id', sessionId)
                .select()
            //vai retornar as informaçoes do banco de dados

            return { transactions }
        })

    app.get(
        '/:id',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getTransactionsParamsSchema.parse(request.params)
            //vai pegar o id do usuario da rota do insomnia 
            const { sessionId } = request.cookies //vai pegar o sessionId do cookie

            const transaction = await knex('transactions')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()

            return {
                transaction,
            }
        },
    )

    app.get(
        '/summary',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies

            const summary = await knex('transactions')
                .where('session_id', sessionId)
                .sum('amount', { as: 'amount' })
                .first()

            return { summary }
        },
    )

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
                sessionId = randomUUID()

                reply.setCookie('sessionId', sessionId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                })
            }

            await knex('transactions').insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_id: sessionId,
            })

            return reply.status(201).send()
        })
}