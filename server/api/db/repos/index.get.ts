import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { projectId, packageJson, pipeline } = getQuery(event)
  const prisma = new PrismaClient()

  const whereQuery:any = {
    isApi: true
  }

  if (projectId) { whereQuery.projectId = projectId }
  if (packageJson) { whereQuery.package = { contains: packageJson} }
  if (pipeline) { whereQuery.pipeline = { contains: pipeline} }

  const repos = await prisma.repo.findMany({
    where: whereQuery,
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return repos
})