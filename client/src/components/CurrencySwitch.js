import React, { Component } from 'react';
import PropTypes from 'prop-types';

import arrowUp from '../images/arrow-up.png';
import arrowDown from '../images/arrow-down.png';

class CurrencySwitch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: false
        }
    }
    static get propTypes() { 
        return { 
            currency: PropTypes.object,
            currencies: PropTypes.arrayOf(PropTypes.object),
            setCurrency: PropTypes.func
        }; 
    }    

    render() {
        let items = '';

        if (this.props.currencies) {

            items = this.props.currencies.map(currency => 
                <li key={currency.label}
                    className={`
                        currency-list-item
                        ${currency.label === this.props.currency.label
                        ? 'currency-list-item-selected'
                        : ''}
                    `}
    
                    onClick={() => {
                        this.props.setCurrency(currency);
                        this.setState({display: false});
                        sessionStorage.setItem(
                            'chosenCurrency', JSON.stringify(currency)
                        );
                    }}>
                        <span className='currency-list-symbol'>
                            {currency.symbol}
                        </span>
                        <span className='currency-list-label'>
                            {currency.label}
                        </span>
                </li>
            );
        }
        
        return (
            <div 
                className='currency-wrapper' 
                onMouseLeave={() => this.setState({display: false})}>
                    
                <div onClick={() => this.setState({display: true})}>
                    <span className={'currency-wrapper-sign'}>
                        {this.props.currency.symbol}
                    </span>

                    <span>{this.state.display 
                        ? <img src={arrowDown} alt="arrow-down" /> 
                        : <img src={arrowUp} alt="arrow-up" />}
                    </span>
                </div>
                
                {this.state.display &&
                    <ul className='currency-list'>
                        {items}
                    </ul>
                }
            </div>
        )
    }
}
export default CurrencySwitch;
