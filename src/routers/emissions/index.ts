import { Router } from 'express'

import MeasureAPI from '@/services/measure/api'
import { logger } from '@/logger'
import { DayQuerySchema, MonthQuerySchema, validateQuery } from '../../validators/emissions'
import dayjs from 'dayjs'
import type { Response } from 'express';

// -------- HELPER FUNCTIONS --------

type EmissionsEntry = { totalEmissions: number; date?: string }

const calculateMetadata = (responses: EmissionsEntry[]): { totalEmissions: number; high: EmissionsEntry; low: EmissionsEntry } => {
  const totalEmissions = responses.reduce((sum, item) => sum + item.totalEmissions, 0);
  const high = responses.reduce((max, day) => day.totalEmissions > max.totalEmissions ? day : max)
  const low  = responses.reduce((min, day) => day.totalEmissions < min.totalEmissions ? day : min)

  return {
    totalEmissions,
    high,
    low
  };
}

const isDateRangeValid= (dates: string[], res: Response) : boolean => {
  const today = dayjs().format('YYYY-MM-DD');
  const futureDates = dates.filter((date) => date > today);

  if (futureDates.length > 0) {
    res.status(422).json({
      error: 'Date range cannot include future dates.'
    });
    logger.debug({ dates }, 'Date range cannot include future dates.');
    return false;
  }

  return true;
}

const isResponseValid = (responses: { date: string; totalEmissions: number; }[], res: Response) : boolean => {
    const validResponses = responses.filter((response) => response.totalEmissions > 0);
    if (validResponses.length === 0) {
      res.status(404).json({ error: 'No emissions data found' });
      logger.debug({ responses }, 'No emissions data found');
      return false;
    }
    return true;
}

const createDateRangeMeasurePromises = (domain: string, dates: string[]) => {
  return (
    dates.map(async (d) => {
      const response = await MeasureAPI.measure([domain], d)
      return { date: d, totalEmissions: response.totalEmissions }
    })
  )
}

// -------- ROUTES --------

const router = Router({ mergeParams: true, strict: true })

router.get('/day', validateQuery(DayQuerySchema), async (req, res) => {
  const { domain, date } = req.query as {
    domain: string
    date: string
  }

  logger.debug({ domain, date }, 'Received /day request')

  if (dayjs(date).isAfter(dayjs().format('YYYY-MM-DD'))) {
    res.status(422).json({
      error: 'Date cannot be in the future.'
    });
    logger.debug({ date }, 'Date cannot be in the future.');
    return;
  }

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

router.get('/week', validateQuery(DayQuerySchema), async (req, res) => {
  const { domain, date } = req.query as { domain: string; date: string }
  logger.debug({ domain, date }, 'Received /week request')

  const dates = Array.from({ length: 7 }, (_, i) =>
    dayjs(date).add(i, 'day').format('YYYY-MM-DD')
  )
  if (!isDateRangeValid(dates, res)) { return; }

  try {
    const responses = await Promise.all(createDateRangeMeasurePromises(domain, dates));
    if (!isResponseValid(responses, res)) { return; }
    const metadata = calculateMetadata(responses);

    res.json({
      domain,
      dates,
      totalEmissions: metadata.totalEmissions,
      high: { value: metadata.high.totalEmissions, date: metadata.high.date },
      low: { value: metadata.low.totalEmissions, date: metadata.low.date },
      average: metadata.totalEmissions / dates.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/month', validateQuery(MonthQuerySchema), async (req, res) => {
  const { domain, date: month } = req.query as {
    domain: string
    date: string
  }
  logger.debug({ domain, month }, 'Received /month request')

  const dates = Array.from({ length: dayjs(month).daysInMonth() }, (_, i) =>
    dayjs(month+'-01').add(i, 'day').format('YYYY-MM-DD')
  )
  if (!isDateRangeValid(dates, res)) { return; }

  try {
    const responses = await Promise.all(createDateRangeMeasurePromises(domain, dates));
    if (!isResponseValid(responses, res)) { return; }
    const metadata = calculateMetadata(responses);

    res.json({
      domain,
      dates,
      totalEmissions: metadata.totalEmissions,
      high: { value: metadata.high.totalEmissions, date: metadata.high.date },
      low: { value: metadata.low.totalEmissions, date: metadata.low.date },
      average: metadata.totalEmissions / dates.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

export default router
