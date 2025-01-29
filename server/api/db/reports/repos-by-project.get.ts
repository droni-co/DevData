import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const repos = await prisma.repo.groupBy({
    where: {
      isApi: true
    },
    by: ['projectId', 'projectName'],
    _count: {
      id: true
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
      projectId: repo.projectId,
      projectName: repo.projectName,
      count: repo._count.id
    })
  }

  return result
})