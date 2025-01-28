import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const repos = await prisma.repo.groupBy({
    where: {
      isApi: true
    },
    by: ['project'],
    _count: {
      id: 1
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  })

  const result = []

  for (const repo of repos) {
    result.push({
      project: repo.project,
      count: repo._count.id
    })
  }

  return result
})