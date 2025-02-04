import { AzureQueryService } from "../../../services/AzureQuery.service";
import { Durations } from "@azure/monitor-query";

const query = async () => {
  try {
    const logsClient = await AzureQueryService.logsClient()
    const workspaceId = String(process.env.WORKSPACE_ID)
    const query = `AppServiceConsoleLogs
      | where _ResourceId contains "APSV-PR"
      | where Level == "Error"
      | project TimeGenerated, Level, ResultDescription, _ResourceId`
    const kustoQuery = "AppServiceConsoleLogs";
    const records = await logsClient.queryWorkspace(workspaceId, kustoQuery, { duration: Durations.oneHour })
    return records
  } catch (error) {
    console.error(error)
    return null
  }  
}

export default defineEventHandler(async (event) => {
  
  const result = await query()
  return { hola: 'hola' }
})
