import { expect, test, beforeAll, afterAll, describe } from 'vitest';
import server from 'node:http'
import request from 'supertest'
import { app } from '../src/app'
import { setCookie } from 'undici-types';

describe('transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
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
})