import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient } from '@prisma/client'
import YAML from 'yaml'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const file = await gitApi.getItemContent(id, 'azure-pipelines.yml')
  const confirm = file.on('data', async (content) => {
    let fullData = ''
    fullData += await content.toString()

    const prisma = new PrismaClient()
    const repo = await prisma.repo.update({
      where: {
        id: id
      },
      data: {
        pipeline: fullData,
        updatedAt: new Date()
      }
    })
    return content
  })
  return confirm
})