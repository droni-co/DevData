import { AzureQueryService } from "../../../services/AzureQuery.service";
import { Durations } from "@azure/monitor-query";

export default defineEventHandler(async (event) => {
  const logsClient = await AzureQueryService.logsClient()
  const resourceId = '/subscriptions/4271a21d-b0b3-4618-b735-d109ef5c64fe/resourceGroups/RSGR-DS-NNFF-001/providers/Microsoft.Web/sites/APSV-DS-NNFF-SSS-003'
  const records = await logsClient.queryResource(resourceId, 'AppServiceConsoleLogs', { duration: Durations.oneHour }, {
    serverTimeoutInSeconds: 600,
    includeQueryStatistics: true,
  })

  return records
})
