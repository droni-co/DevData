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
        GET = countif(ResultDescription startswith "GET"),
        POST = countif(ResultDescription startswith "POST"),
        PUT = countif(ResultDescription startswith "PUT"),
        PATCH = countif(ResultDescription startswith "PATCH"),
        DELETE = countif(ResultDescription startswith "DELETE"),
        OPTIONS = countif(ResultDescription startswith "OPTIONS")
      | project GET, POST, PUT, PATCH, DELETE, OPTIONS
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
          e500 = countif(ResultDescription contains " 500"),
          e501 = countif(ResultDescription contains " 501"),
          e502 = countif(ResultDescription contains " 502"),
          e503 = countif(ResultDescription contains " 503"),
          e504 = countif(ResultDescription contains " 504"),
          e505 = countif(ResultDescription contains " 505"),
          e400 = countif(ResultDescription contains " 400"),
          e401 = countif(ResultDescription contains " 401"),
          e402 = countif(ResultDescription contains " 402"),
          e403 = countif(ResultDescription contains " 403"),
          e404 = countif(ResultDescription contains " 404")
      | project e500, e501, e502, e503, e504, e505, e400, e401, e402, e403, e404
    `,
    errorsByResource: `AppServiceConsoleLogs
      | where Level == "Error"
      | extend AppService = tostring(split(_ResourceId, "/")[8])
      | summarize Count=count() by AppService
      | project AppService, Count
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
