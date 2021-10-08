import ReactHighcharts from 'react-highcharts';
import { AppContext } from '../App/AppProvider';
import highchartsConfig from './HighchartsConfig';
import { Tile } from '../Shared/Tile';
import HighchartsTheme from './HighchartsTheme';
import ChartSelect from './ChartSelect';

ReactHighcharts.Highcharts.setOptions(HighchartsTheme);

export default function () {
    return (
        <AppContext.Consumer>
            {({historical, changeChartSelect, currentFavorite, coinList}) =>
              <Tile>
                  <ChartSelect
                    defaultValue={"months"}
                    onChange={e => changeChartSelect(e.target.value)}
                  >
                      <option value="hours">24-Hours</option>
                      <option value="days">30-Days</option>
                      <option value="months">12-Months</option>
                  </ChartSelect>
                  {historical ? 
                    <ReactHighcharts config={highchartsConfig(historical, coinList[currentFavorite].CoinName)} /> 
                    : <div>Loading Historical Data...</div>}
              </Tile>
            }
        </AppContext.Consumer>
    )
}