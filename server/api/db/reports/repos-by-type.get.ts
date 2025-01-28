import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const repos = await prisma.repo.groupBy({
    by: ['isApi', 'isExp'],
    _count: {
      id: 1
    }
  })

  return {
    others: repos.find((r: { isExp: boolean, isApi: boolean }) => r.isExp === false && r.isApi === false)?._count.id || 0,
    api: repos.find((r: { isApi: boolean }) => r.isApi === true)?._count.id || 0,
    exp: repos.find((r: { isExp: boolean, isApi: boolean }) => r.isExp === true && r.isApi === true)?._count.id || 0,
  }
})