import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { execSync } from ' node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
    beforeAll(async () => {


        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test('o usuario consegue criar uma nova transicao no test', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'new transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    test('o usuario consegue consultar todas transicao no test', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'new transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookie = createTransactionResponse.get('setCookie')

        const listTransactionsResponse = await request(app.server)
        get('/transactions')
        set('Cookie', cookies)
        expect(200)  

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })


     test('deve ser capaz de obter uma transação específica', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'new transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions' )
            .set('Cookie', cookies)
            .expect(200)  

        const transactionId = listTransactionsResponse.body.transactions[0]

        const getTransactionsResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200) 

        expect(getTransactionsResponse.body.transaction).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })
})