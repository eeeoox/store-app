import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import AttributeItem from './AttributeItem';
import CartItem from './CartItem';

class CartPage extends Component {
    constructor(props) {
        super(props);

        this.checkCartItems = this.checkCartItems.bind(this);
    }

    static get propTypes() {
        return {
            class: PropTypes.string,
            isMiniCart: PropTypes.bool,
            label: PropTypes.string,
            productList: PropTypes.arrayOf(PropTypes.string),
            productsAmount: PropTypes.arrayOf(PropTypes.number),
            productListHandler: PropTypes.func,
            setDisplayMode: PropTypes.func
        }
    }

    checkCartItems(cartItems) {
        if (this.props.isMiniCart === true && cartItems[0] !== undefined) {
            return true
        } else {
            return false
        }
    }

    render() {
        let listItems = this.props.productList;
        let total = 0;
        let symbol = '';

        let cartItems = this.props.productList.map(product => {
                let element = JSON.parse(product);
                let {name, brand} = element;
                let attributes = element.attributes.map(attribute => {
                    return (
                        <div key={attribute.id} className="attribute-container">
                            <h4>{attribute.id}</h4>
                            <AttributeItem  
                                isCartAtrribute={true}
                                itemObj={attribute}>
                            </AttributeItem>
                        </div>
                    )
                });

                let index = listItems.indexOf(product);
                let prodAmount = this.props.productsAmount[index];
                let priceObj = element.prices.filter(price => 
                    price.currency.label === this.props.label
                );

                if (priceObj[0]) {
                    let price = priceObj[0].amount;
                    let priceTotal = prodAmount * price;

                    symbol = priceObj[0].currency.symbol;
                    total += priceTotal;

                    let cartItemData = {name, brand, symbol, price, 
                        attributes, prodAmount, element
                    }

                    return (
                        <CartItem 
                            key={uuidv4()} 
                            data={cartItemData}
                            class={this.props.class}
                            isMiniCart={this.props.isMiniCart}
                            productListHandler={this.props.productListHandler}>
                        </CartItem>
                    )
                }
            }
        );

    return (
        <>
            <div className={this.props.class}>
                {cartItems[0] 
                ? cartItems 
                : <div className='empty-cart-msg'>Your bag is empty</div>}
            </div>
            
            {this.checkCartItems(cartItems) &&
                <div className="cart-mini-lower-bar">
                    <h4 className='cart-mini-total'>
                        <span>Total</span>
                        <span>{total.toFixed(2)}{symbol}</span> 
                    </h4>

                    <div className="cart-mini-btns">
                        <Link to={'/cart'}>
                            <div 
                                className="cart-mini-view-bag" 
                                onClick={() => this.props.setDisplayMode(false)}>
                                VIEW BAG
                            </div>
                        </Link>

                        <div 
                            className="cart-mini-checkout" 
                            onClick={() => this.props.setDisplayMode(false)}>
                            CHECK OUT
                        </div>
                    </div>
                </div>
            }
        </>
    )}
}
export default CartPage;