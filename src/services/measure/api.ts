import axios, { type AxiosInstance } from 'axios'
import { z } from 'zod'
import { MeasureResponseSchema, type MeasureResponse } from './response-types'

import { config } from '@/config'
import { logger } from '@/logger'

const BASE_URL = 'https://api.scope3.com/v2'

const MeasureRowSchema = z.object({
  rowIdentifier: z.string(),
  impressions: z.number(),
  utcDatetime: z.string(),
  inventoryId: z.string(),
  appStore: z.string(),
  country: z.string(),
  region: z.string(),
  deviceType: z.string(),
  channel: z.string(),
  network: z.string(),
})

const RequestRowSchema = z.object({
  inventoryId: z.string(),
  impressions: z.number(),
  deviceType: z.string(),
  rowIdentifier: z.string(),
  utcDatetime: z.string(),
})

const MeasureQueryParamsSchema = z.object({
  includeRows: z.boolean(),
  latest: z.boolean(),
  fields: z.string(),
  framework: z.string(),
})

type MeasureRow = z.infer<typeof MeasureRowSchema>
type RequestRow = z.infer<typeof RequestRowSchema>
type MeasureQueryParams = z.infer<typeof MeasureQueryParamsSchema>

const defaultMeasureQueryParams: MeasureQueryParams = {
  includeRows: true,
  latest: false,
  fields: 'all',
  framework: 'scope3',
}

class Client {
  private readonly httpClient: AxiosInstance

  constructor() {
    this.httpClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  static new(): Client {
    return new Client()
  }

  private static createRequestRow(
    inventoryId: string,
    utcDatetime: string
  ): RequestRow {
    return {
      inventoryId,
      impressions: 1,
      deviceType: 'pc',
      rowIdentifier: inventoryId,
      utcDatetime,
    }
  }

  async measure(
    inventoryIds: string[],
    requestDate: string
  ): Promise<MeasureResponse> {
    const rows = inventoryIds.map((id) =>
      Client.createRequestRow(id, requestDate)
    )

    const jsonData = {
      rows: rows.map((row) => ({
        country: 'US',
        inventoryId: row.inventoryId,
        impressions: row.impressions,
        deviceType: row.deviceType,
        rowIdentifier: row.rowIdentifier,
        utcDatetime: row.utcDatetime,
      })),
    }

    logger.debug(
      {
        url: `${BASE_URL}/measure`,
        body: jsonData,
      },
      'request details'
    )

    try {
      const response = await this.httpClient.post<MeasureResponse>(
        '/measure',
        jsonData,
        {
          params: defaultMeasureQueryParams,
        }
      )

      const validatedData = MeasureResponseSchema.parse(response.data)

      logger.debug(
        { requestId: validatedData.requestId },
        'Successfully validated API response'
      )

      return validatedData
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
          'API request failed'
        )
        const errorMessage = error.response?.data
          ? `API request failed: ${error.message}, body: ${JSON.stringify(error.response.data)}`
          : `API request failed: ${error.message}`
        throw new Error(errorMessage)
      }

      if (error instanceof z.ZodError) {
        logger.error(
          {
            errors: error.issues,
          },
          'API response validation failed'
        )
        throw new Error(
          `API response validation failed: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        )
      }

      throw error
    }
  }
}

export default Client.new()
export { MeasureRowSchema, RequestRowSchema, MeasureQueryParamsSchema }
export type { MeasureRow, RequestRow, MeasureQueryParams }
