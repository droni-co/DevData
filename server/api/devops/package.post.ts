import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const file = await gitApi.getItemContent(id, 'package.json')
  const confirm = file.on('data', async (content) => {
    const packageJsonContent = await content.toString()
    const jsonData = JSON.parse(packageJsonContent)

    console.log(jsonData.name)

    const prisma = new PrismaClient()
    const repo = await prisma.repo.update({
      where: {
        id: id
      },
      data: {
        package: packageJsonContent,
        updatedAt: new Date()
      }
    })
  })
  return confirm.read().toString()
})