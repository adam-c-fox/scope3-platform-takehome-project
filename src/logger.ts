import pino from 'pino'
import pretty from 'pino-pretty'
import { config } from './config'

const stream = pretty({ colorize: true })

export const logger = pino(
  { level: config.logLevel?.toLowerCase() ?? 'info' },
  stream
)
