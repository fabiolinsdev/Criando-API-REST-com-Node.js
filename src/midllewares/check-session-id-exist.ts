import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(     // Função middleware para verificar se o sessionId existe no cookie
  request: FastifyRequest,   
  reply: FastifyReply,   // requisição da resposta do Fastify
) {
  const sessionId = request.cookies.sessionId  // Obtém o sessionId do cookie da requisição

  if (!sessionId) { // Verifica se o sessionId existe no cookie
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}