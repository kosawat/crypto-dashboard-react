import moment from 'moment';

export default function (historical, coinName) {
    
return {

    title: {
      text: 'Historical Price'
    },
    
    yAxis: {
      title: {
        text: 'Price'
      }
    },
  
    xAxis: {
      type: 'datetime'
    },
  
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
  
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010,
        point: {
          events: {
            click: (e) => { window.open(`https://news.google.com/search?q=${coinName}%20after%3A${moment(e.point.x).format('YYYY-MM-DD')}%20before%3A${moment(e.point.x).add(1, 'days').format('YYYY-MM-DD')}&hl=en-US`)}//console.log(moment(e.point.x).format('YYYY-MM-DD'));
          }
        }
      }
    },
  
    series: historical,
  
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  
  }
}