import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const file = await gitApi.getItemContent(id, 'package.json')
  const confirm = file.on('data', async (content) => {

    let fullData = ''
    fullData += String(await content.toString())

    const prisma = new PrismaClient()
    const repo = await prisma.repo.update({
      where: {
        id: id
      },
      data: {
        package: fullData,
        updatedAt: new Date()
      }
    })
  })
  return confirm.read().toString()
})