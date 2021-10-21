import React from 'react';
import _ from 'lodash';
import moment from 'moment';

const cc = require('cryptocompare');
cc.setApiKey(process.env.REACT_APP_CC_API_KEY);

export const AppContext = React.createContext();

const MAX_FAVORITES = 10;
const TIME_UNITS = 11;

export class AppProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state= {
            page: 'dashboard',
            favorites: ['BTC', 'ETH', 'LTC', 'XMR'],
            timeInterval: 'months',
            ...this.savedSettings(),
            setPage: this.setPage,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavorites: this.isInFavorites,
            confirmFavorites: this.confirmFavorites,
            setCurrentFavorite: this.setCurrentFavorite,
            setFilteredCoins: this.setFilteredCoins,
            changeChartSelect: this.changeChartSelect
        }  
    }

    addCoin = key => {
        let favorites = [...this.state.favorites];
        if(favorites.length < MAX_FAVORITES) {
            favorites.push(key);
            this.setState({favorites});
        }
    }

    removeCoin = key => {
        let favorites = [...this.state.favorites];
        this.setState({favorites: _.pull(favorites, key)});
    }

    isInFavorites = key => _.includes(this.state.favorites, key);

    componentDidMount = () => {
        this.fetchCoins();
        this.fetchPrices();
        this.fetchHistorical();
    }

    fetchCoins = async () => {
      let coinList = (await cc.coinList()).Data;
      //console.log(coinList);
      this.setState({coinList});
    }

    fetchPrices = async () => {
        if(this.state.firstVisit) return;
        let prices = await this.prices();
        // We must filter the empty price objects (not in the lecture)
        prices = prices.filter(price => Object.keys(price).length);
        this.setState({prices});
    }

    fetchHistorical = async () => {
        if(this.state.firstVisit) return;
        let results = await this.historical();
        let time_units = 0;
        switch (this.state.timeInterval) {
            case 'hours':
                time_units = 23;
                break;
            case 'days':
                time_units = 29;
                break;
            case 'months':
                time_units = 11;
                break;
            default:
                break;
        }
        let historical = [
            {
                name: this.state.currentFavorite,
                data: results.map((ticker, index) => [
                    moment().subtract({[this.state.timeInterval]: time_units - index}).valueOf(),
                    ticker.USD
                ])
            }
        ]
        this.setState({historical});
    }

    prices = async () => {
        let returnData = [];
        for(let i = 0; i < this.state.favorites.length; i++) {
            try {
                let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
                returnData.push(priceData);
            } catch (err) {
                console.warn('Fetch price error: ', err);
            }
        }
        //console.log(returnData);
        return returnData;
    }

    historical = () => {
        let promises = [];
        let time_units = 0;
        switch (this.state.timeInterval) {
            case 'hours':
                time_units = 23;
                break;
            case 'days':
                time_units = 29;
                break;
            case 'months':
                time_units = 11;
                break;
            default:
                break;
        }
        for (let units = time_units; units >= 0; units--) {
            promises.push(
                cc.priceHistorical(
                    this.state.currentFavorite,
                    ['USD'],
                    moment().subtract({[this.state.timeInterval]: units}).toDate()
                )
            )
        }
        //console.log(promises);
        return Promise.all(promises);
    }

    confirmFavorites = () => {
        let currentFavorite = this.state.favorites[0];
        this.setState({
            firstVisit: false,
            page: 'dashboard',
            currentFavorite,
            prices: null,
            historical: null
        }, () => {
            this.fetchPrices();
            this.fetchHistorical();
        });
        localStorage.setItem('cryptoDashboard', JSON.stringify({
            favorites: this.state.favorites,
            currentFavorite
        }));
    }

    setCurrentFavorite = (sym) => {
        this.setState({
            currentFavorite: sym,
            historical: null
        }, this.fetchHistorical);

        localStorage.setItem('cryptoDashboard', JSON.stringify({
            ...JSON.parse(localStorage.getItem('cryptoDashboard')),
            currentFavorite: sym
        }));
    }

    savedSettings() {
        let cryptoDashboardData = JSON.parse(localStorage.getItem('cryptoDashboard'));
        if(!cryptoDashboardData) {
            return {page: 'settings', firstVisit: true}
        }
        let {favorites, currentFavorite} = cryptoDashboardData;
        return{favorites, currentFavorite};
    }

    setPage = page => this.setState({page});

    setFilteredCoins = (filteredCoins) => this.setState({filteredCoins}); 

    changeChartSelect = (value) => {
        this.setState({timeInterval: value, historical: null}, this.fetchHistorical);

    }

    render(){
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}