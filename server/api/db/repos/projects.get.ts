import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {

  const prisma = new PrismaClient()

  const projects = await prisma.repo.findMany({
    where: {
      isApi: true
    },
    distinct: ['projectId'],
  })
  return projects
})