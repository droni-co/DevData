import { AzureApiService } from "../../../services/AzureDev.service";

export default defineEventHandler(async (event) => {
  const gitApi = await (await AzureApiService.connection()).getGitApi()
  const repositories = await gitApi.getRepositories();
  return repositories
})