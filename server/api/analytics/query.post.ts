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
    requestByMethod: `AppServiceHTTPLogs
      | summarize Count = count() by CsMethod
      | project CsMethod, Count
    `,
    requestByEndpoint: `AppServiceHTTPLogs
      | where CsUriStem != '/' and CsUriStem != '/ping'
      | extend AppService = tostring(split(_ResourceId, "/")[8])
      | extend Endpoint = CsUriStem
      | summarize Count=count() by Endpoint, AppService
      | project Endpoint, AppService, Count
      | sort by Count desc
    `,
    errorsByType: `AppServiceHTTPLogs
      | where ScStatus >= 300
      | summarize Count = count() by ScStatus
      | project ScStatus, Count
      | order by Count desc
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
      | extend AppService = tostring(split(_ResourceId, "/")[8])
      | summarize Count=count() by AppService
      | project AppService, Count
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
    | project TimeGenerated, Level, ResultDescription, _ResourceId`,
    sessionsByOsBrowser: `SigninLogs
      | extend Os = tostring(DeviceDetail.operatingSystem)
      | extend Browser = tostring(DeviceDetail.browser)
      | summarize Count = count() by Os, Browser
      | project Os, Browser, Count
      | sort by Count desc
    `,
    sessionsByHour: `SigninLogs
      | extend HoraLocal = datetime_utc_to_local(TimeGenerated, "America/Bogota")
      | extend Hora = datetime_part("hour", HoraLocal)
      | summarize Count = count() by Hora
      | project Hora, Count
      | sort by Hora asc`,
    sessionsByWeekday: `SigninLogs
      | extend HoraLocal = datetime_utc_to_local(TimeGenerated, "America/Bogota")
      | extend down = dayofweek(HoraLocal)
      | extend Dia = toint(down/1d) 
      | summarize Count = count() by Dia
      | project Dia, Count
      | sort by Dia asc
    `,
  }

  try {
    const logsClient = await AzureQueryService.logsClient()
    const workspaceId = String(process.env.WORKSPACE_ID)
    const query = querys[report] ?? ''
    console.log('Query:', query)
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
