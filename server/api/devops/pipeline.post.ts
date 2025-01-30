import { AzureApiService } from "../../../services/AzureDev.service";
import { PrismaClient } from '@prisma/client'
import YAML from 'yaml'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const file = await gitApi.getItemContent(id, 'azure-pipelines.yml')
  const confirm = await file.on('data', async (content) => {
    const fileContent = await content.toString()
    const jsonData = YAML.parse(fileContent)
    if(!jsonData.stages) return null
    const branchProd = jsonData.stages?.find((s:any)=> s?.parameters?.branchCondition === 'main')

    console.log('branchProd:', branchProd)

    const prisma = new PrismaClient()
    const repo = await prisma.repo.update({
      where: {
        id: id
      },
      data: {
        pipeline: fileContent,
        updatedAt: new Date()
      }
    })
    return content
  })
  return confirm
})