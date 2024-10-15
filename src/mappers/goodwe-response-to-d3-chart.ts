import {
  getStatisticsChartsResponseSchema,
  type GetStatisticsChartsResponseType
} from '@/models/goodwe/statistics-chart-response'
import type { BackDeliveryChartData } from '@/models/D3/back-delivery-chart-data';

export const mapGoodWeChartResponseToD3Chart = (jsonData: GetStatisticsChartsResponseType): BackDeliveryChartData | void => {
  const validation = getStatisticsChartsResponseSchema.safeParse(jsonData);

  if (!validation.success) {
    console.error('Response data is not according to schema: ', validation.error.errors);
    return;
  }

  return validation.data.data[0].yield.map(({x, y}) => {
    return {
      date: parseDate(x),
      value: y
    }
  });
}

/**
 * GoodWe returns a date as 'MM.YYYY' or as 'MM.DD.YYYY'.
 * Parse this into a correct date.
 */
const parseDate = (dateString: string) => {
  // Check if the format is MM.DD.YYYY
  const ddMmYyyyPattern = /^\d{2}\.\d{2}\.\d{4}$/;
  if (ddMmYyyyPattern.test(dateString)) {
    const [month, day, year] = dateString.split('.').map(Number);

    return new Date(year, month - 1, day);
  }

  // If not DD.MM.YYYY, check for MM.YYYY format
  const mmYyyyPattern = /^\d{2}\.\d{4}$/;
  if (mmYyyyPattern.test(dateString)) {
    const [month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1);
  }

  // Handle invalid format
  throw new Error('Invalid date format');
};

