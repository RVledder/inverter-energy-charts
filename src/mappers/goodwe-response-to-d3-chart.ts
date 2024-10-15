import {
  getStatisticsChartsResponseSchema,
  type GetStatisticsChartsResponseType
} from '@/models/goodwe/statistics-chart-response'
import type { BackDeliveryChartData } from '@/models/D3/back-delivery-chart-data';

export const mapGoodWeResponseToD3Chart = (jsonData: GetStatisticsChartsResponseType): BackDeliveryChartData | void => {
  const validation = getStatisticsChartsResponseSchema.safeParse(jsonData);

  if (!validation.success) {
    console.error('Response data is not according to schema: ', validation.error.errors);
    return;
  }

  return validation.data.data[0].yield.map(({x, y}) => {
    return {
      date: parseGoodWeDate(x),
      value: y
    }
  });
}

/**
 * GoodWe returns a date as 'MM.YYYY'
 */
const parseGoodWeDate = (dateString: string) => {
  const [month, year] = dateString.split('.');
  return new Date(parseInt(year), parseInt(month) - 1);
}

