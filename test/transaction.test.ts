import { expect, test, beforeAll, afterAll, describe } from 'vitest';
import server from 'node:http'
import request from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    test.only('o usuario consegue criar uma nova transicao no test', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'new transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    test.skip('o usuario consegue consultar todas transicao no test', async () => {
        const response = await request(app.server)
        .post('/transactions')
        .send({
            title: 'new transaction',
            amount: 5000,
            type: 'credit'
        })
    })
})