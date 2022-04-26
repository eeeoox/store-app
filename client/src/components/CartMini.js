import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CartPage from './CartPage';
import cartSignNavbar from '../images/cart-sign-navbar.png';

class CartMini extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: false,
        }
        this.setDisplayMode = this.setDisplayMode.bind(this);
    }

    static get propTypes() { 
        return { 
            label: PropTypes.string,
            productList: PropTypes.arrayOf(PropTypes.string),
            productsAmount: PropTypes.arrayOf(PropTypes.number),
            productListHandler: PropTypes.func
        }; 
    }    
    
    setDisplayMode(boolean) {
        this.setState({display: boolean});
    }

    render() {
        let amountOfItems = this.props.productsAmount.reduce(
            (previous, current) => previous + current, 0
        );
        
        return (
            <>
            <div className='cart-mini-wrapper' 
                onMouseLeave={() => this.setState({display: false})}>

                <div className='cart-mini-sign'
                    onClick={() => this.setState({display: true})}>

                    <img src={cartSignNavbar} alt="cart-sign-navbar" />
                    
                    {amountOfItems > 0 && 
                    <div className='cart-mini-counter'>{amountOfItems}</div>}
                </div>

                {this.state.display &&
                    <div className="cart-mini-list">
                        <h4 className='cart-mini-items-amount'>
                            My bag, <span>{amountOfItems} items</span>
                        </h4>
                        <CartPage
                            class='cart-mini'
                            isMiniCart={true}
                            label={this.props.label}
                            productList={this.props.productList}
                            productsAmount={this.props.productsAmount}
                            productListHandler={this.props.productListHandler}
                            setDisplayMode={this.setDisplayMode}
                        />
                    </div>
                }
            </div>
            {this.state.display &&<div className='cart-mini-background'></div>}
            </>
        )
    }
}
export default CartMini;
