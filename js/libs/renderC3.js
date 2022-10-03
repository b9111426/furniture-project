import { totalProductsNum } from '../admin/totalProductNum.js'

export const renderC3 = (productObject) => {
  const chartData = []
  const barChartData = []
  const { numObject, priceObject } = totalProductsNum(productObject)
  Object.keys(numObject).forEach(i => {
    const ary = []
    ary.push(i)
    ary.push(numObject[i])
    chartData.push(ary)
  })

  Object.keys(priceObject).forEach(i => {
    const ary = []
    ary.push(i)
    ary.push(priceObject[i])
    barChartData.push(ary)
  })

  c3.generate({
    bindto: '#productChart',
    size: {
      height: 400
    },
    tooltip: {
      format: {
        value: function (value) {
          return value
        }
      }
    },
    data: {
      type: 'pie',
      columns: chartData
    }
  })

  c3.generate({
    bindto: '#earnChart',
    data: {
      columns: barChartData,
      type: 'bar'
    },
    bar: {
      space: 0.25,
      width: {
        ratio: 1
      }
    },
    axis: {
      x: {
        tick: {
          format: function () { return '單項商品銷售額' }
        }
      }
    }
  })
}
