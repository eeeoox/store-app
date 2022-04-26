import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ImageSwitcher from './ImageSwitcher';
import bin from '../images/bin.png';

class CartItem extends Component {

    static get propTypes() {
        return {
            data: PropTypes.object,
            class: PropTypes.string,
            isMiniCart: PropTypes.bool,
            productListHandler: PropTypes.func
        }
    }

    render() {
        let {name, brand, symbol, 
            price, attributes, prodAmount, 
            element} = this.props.data;

        return (
            <div className='cart-item'>
                <div className="cart-left">
                    <h4 className='cart-left-name'>{name}</h4>
                    <h4 className='cart-left-brand'>{brand}</h4>

                    <div className='cart-left-price'>
                        {symbol} {price.toFixed(2)}
                    </div>
                    <div className='cart-left-attrs'>
                        {attributes}
                    </div>
                </div>
                
                <div className="cart-right">
                    <div className="cart-item-counter">
                        <button 
                            onClick={() => 
                            this.props.productListHandler(element, 'add')}>+
                        </button>

                        <span>{prodAmount}</span>

                        <button 
                            onClick={() => 
                            this.props.productListHandler(element, 'reduce')}>-
                        </button>
                    </div>

                    {this.props.isMiniCart
                    ? <div className="cart-item-image">
                        <img src={element.images[0]} alt={element.name} />
                    </div>
                    :<ImageSwitcher 
                        images={element.images}
                        name={element.name}>
                    </ImageSwitcher>}

                    <div className="cart-item-delete">
                        <img src={bin} alt="bin-img" onClick={() => 
                            this.props.productListHandler(element, 'delete')}/>
                    </div>
                </div>
            </div>
        )
    }
}
export default CartItem;
