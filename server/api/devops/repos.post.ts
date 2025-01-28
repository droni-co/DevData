import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient, Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const repositories = await gitApi.getRepositories();

  const prisma = new PrismaClient()

  for (const repo of repositories) {
    // check if repo.name contains the word "api"
    const result = await prisma.repo.upsert({
      where: { id: repo.id },
      update: {
        name: repo.name,
        url: repo.webUrl,
        project: repo.project!.name,
        size: repo.size,
        defaultBranch: repo.defaultBranch,
        isApi: String(repo.name).toLowerCase().includes("api"),
        isExp: String(repo.name).toLowerCase().includes("experiencia")
      },
      create: {
        id: repo.id,
        name: repo.name,
        url: repo.webUrl,
        project: repo.project!.name,
        size: repo.size,
        defaultBranch: repo.defaultBranch,
        isApi: String(repo.name).toLowerCase().includes("api"),
        isExp: String(repo.name).toLowerCase().includes("experiencia")
      }
    })    
  }
  return repositories
})