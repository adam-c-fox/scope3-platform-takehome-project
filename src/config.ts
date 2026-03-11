export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export class Config {
  private static _instance: Config | null = null
  private _apiKey: string
  private _logLevel: LogLevel

  private constructor() {
    const apiKey = process.env.SCOPE3_API_KEY
    if (!apiKey) {
      throw new Error('SCOPE3_API_KEY environment variable is required')
    }
    this._apiKey = apiKey

    const logLevel = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal']

    if (!validLevels.includes(logLevel)) {
      throw new Error(
        `Invalid LOG_LEVEL. Must be one of: ${validLevels.join(', ')}`
      )
    }

    this._logLevel = logLevel
  }

  public static getInstance(): Config {
    if (!Config._instance) {
      Config._instance = new Config()
    }
    return Config._instance
  }

  public get apiKey(): string {
    return this._apiKey
  }

  public get logLevel(): LogLevel {
    return this._logLevel
  }
}

export const config = Config.getInstance()
