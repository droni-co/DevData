import { AzureQueryService } from "../../../services/AzureQuery.service";

export default defineEventHandler(async (event) => {
  const { fromDate, toDate, report, description } = await readBody(event) as { fromDate: string, toDate: string, report: keyof typeof querys, description: string }

  const querys: { [key: string]: string } = {
    errorsByDescription: `AppServiceConsoleLogs
      | where Level == "Error"
      | summarize Count=count() by ResultDescription
      | project ResultDescription, Count
      | sort by Count desc
    `,
    requestByMethod: `AppServiceConsoleLogs
      | where ResultDescription !startswith "GET /ping"
      | summarize 
        CountGet = countif(ResultDescription startswith "GET"),
        CountPost = countif(ResultDescription startswith "POST"),
        CountPut = countif(ResultDescription startswith "PUT"),
        CountPatch = countif(ResultDescription startswith "PATCH"),
        CountDelete = countif(ResultDescription startswith "DELETE"),
        CountOptions = countif(ResultDescription startswith "OPTIONS")
      | project CountGet, CountPost, CountPut, CountPatch, CountDelete, CountOptions
    `,
    requestByEndpoint: `AppServiceConsoleLogs
      | where ResultDescription !startswith "GET /ping"
      | where ResultDescription !startswith "GET / "
      | where ResultDescription startswith "GET /"
              or ResultDescription startswith "POST /"
              or ResultDescription startswith "PUT /"
              or ResultDescription startswith "PATHC /"
              or ResultDescription startswith "DELETE /"
              or ResultDescription startswith "OPTIONS /"
      | extend Endpoint = tostring(split(ResultDescription, " ")[1])
      | extend AppService = tostring(split(_ResourceId, "/")[8])
      | summarize Count=count() by Endpoint, AppService
      | project Endpoint, AppService, Count
      | sort by Count desc 
    `,
    errorsByType: `AppServiceConsoleLogs
      | where Level == "Error"
      | summarize 
          Count500 = countif(ResultDescription contains " 500"),
          Count501 = countif(ResultDescription contains " 501"),
          Count502 = countif(ResultDescription contains " 502"),
          Count503 = countif(ResultDescription contains " 503"),
          Count504 = countif(ResultDescription contains " 504"),
          Count505 = countif(ResultDescription contains " 505"),
          Count400 = countif(ResultDescription contains " 400"),
          Count401 = countif(ResultDescription contains " 401"),
          Count402 = countif(ResultDescription contains " 402"),
          Count403 = countif(ResultDescription contains " 403"),
          Count404 = countif(ResultDescription contains " 404"),
          Count405 = countif(ResultDescription contains " 405")
      | project Count500, Count501, Count502, Count503, Count504, Count505, Count400, Count401, Count402, Count403, Count404, Count405
    `,
    errorsByResource: `AppServiceConsoleLogs
      | where Level == "Error"
      | summarize Count=count() by _ResourceId
      | project _ResourceId, Count
      | sort by Count desc
    `,
    resourceByError: `AppServiceConsoleLogs
      | where Level == "Error"
      | where ResultDescription contains "${description}"
      | summarize Count=count() by _ResourceId
      | project _ResourceId, Count
      | sort by Count desc
    `,
    allLogs: `AppServiceConsoleLogs
    | where ResultDescription !startswith "GET /ping"
    | where ResultDescription startswith "GET"
        or ResultDescription startswith "POST"
        or ResultDescription startswith "PUT"
        or ResultDescription startswith "PATHC"
        or ResultDescription startswith "DELETE"
        or ResultDescription startswith "OPTIONS"
        or Level == "Error"
    | project TimeGenerated, Level, ResultDescription, _ResourceId`
  }

  try {
    const logsClient = await AzureQueryService.logsClient()
    const workspaceId = String(process.env.WORKSPACE_ID)
    const query = querys[report] ?? ''
console.log(query)
    const records = await logsClient.queryWorkspace(workspaceId, query, {
      startTime: new Date(Date.parse(fromDate)),
      endTime: new Date(Date.parse(toDate))
    })

    return records
  } catch (error) {
    console.error(error)
    return error
  }  
})
