import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const packageJson = await (await gitApi.getItemContent(id, 'package.json')).read().toString()

  const prisma = new PrismaClient()
  const repo = await prisma.repo.update({
    where: {
      id: id
    },
    data: {
      package: packageJson
    }
  })


  return repo
})