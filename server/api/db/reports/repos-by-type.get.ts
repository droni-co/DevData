import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const repos = await prisma.repo.groupBy({
    where: {
      isApi: true
    },
    by: ['isExp'],
    _count: {
      id: 1
    }
  })

  return {
    exp: repos.find((r: { isExp: boolean }) => r.isExp === true)?._count.id || 0,
    nonExp: repos.find((r: { isExp: boolean }) => r.isExp === false)?._count.id || 0
  }
})