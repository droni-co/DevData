import { DefaultAzureCredential } from "@azure/identity";
import { LogsQueryClient } from "@azure/monitor-query";

export class AzureQueryService {
  static async logsClient() {
    const credential = new DefaultAzureCredential();
    const logsQueryClient: LogsQueryClient = new LogsQueryClient(credential);

    return logsQueryClient;
  }
}