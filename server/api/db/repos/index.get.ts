import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const repos = await prisma.repo.findMany({
    where: {
      isApi: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return repos
})