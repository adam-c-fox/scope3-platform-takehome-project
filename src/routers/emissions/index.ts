import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'

const router = Router({ mergeParams: true, strict: true })

router.get('/day', async (req, res) => {
  const { domain, date } = req.query as {
    domain: string
    date: string
  }

  logger.debug({ domain, date }, 'Received /day request')

  // TODO: We need to validate the input parameters

  try {
    const response = await MeasureAPI.measure([domain], date)

    if (response.totalEmissions) {
      res.json({ totalEmissions: response.totalEmissions, domain, date })
      return
    }

    res.status(404).json({ error: 'No emissions data found' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/week', async (req, res) => {
  const { domain, date } = req.query as { domain: string; date: string }

  // TODO - Implement the logic to sum `totalEmissions` for the given domain's emissions for the week
  // the date is the start of the week
  res.json({
    domain,
    dates: [],
    totalEmissions: 0,
    high: { value: 0, date: '' },
    low: { value: 0, date: '' },
  })
})

router.get('/month', async (req, res) => {
  const { domain, date: month } = req.query as {
    domain: string
    date: string
  }
  // TODO - Implement the logic to sum `totalEmissions` for the given domain's emissions for the month
  // the date is the start of the month
  res.json({ domain, month })
})

export default router
