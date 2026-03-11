import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'

import { logger } from '@/logger'
import emissionsRouter from '@/routers/emissions'

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000

const app = express()
app.use(
  pinoHttp({
    logger,
    customSuccessMessage: (req, res, responseTime) => {
      return `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`
    },
    customErrorMessage: (req, res, error) => {
      return `${req.method} ${req.url} ${res.statusCode} ${error.message}`
    },
    serializers: {
      req: () => undefined,
      res: () => undefined,
      responseTime: () => undefined,
    },
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/hello', (req, res) => {
  res.send('Hello, world!')
})

app.use('/emissions', emissionsRouter)

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
