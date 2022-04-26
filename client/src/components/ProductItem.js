import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import outOfStockImg from '../images/out-of-stock.png';
import cartSign from '../images/cart-sign-page.png';

class ProductItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cartBtnAppear: false,
            cartBtnDisapp: false
        }
        this.formProduct = this.formProduct.bind(this);
    }

    static get propTypes() {
        return {
            product: PropTypes.object,
            label: PropTypes.string,
            loadedImgs: PropTypes.number,
            countLoadedImgs: PropTypes.func,
            productListHandler: PropTypes.func
        }
    }

    formProduct() {
        let selectedAttrs = [];
        let {attributes, brand, gallery, id, name, prices} = this.props.product;

        attributes.forEach(attribute => {
            let initialData = {
                id: attribute.id, 
                type: attribute.type, 
                items: [attribute.items[0]]
            }

            selectedAttrs.push(initialData);
        });
        
        let product = {
            id: id, 
            name: name, 
            images: gallery, 
            attributes: selectedAttrs, 
            prices: prices, 
            brand: brand
        }
        this.props.productListHandler(product, 'add');
    }

    render() {
        let {name, brand} = this.props.product;

        let image = React.createElement('img', {
            src: this.props.product.gallery[0], 
            alt: this.props.product.name,
            className: 'product-item-img',
            onLoad: () => {
                let amount = this.props.loadedImgs + 1;
                this.props.countLoadedImgs(amount);
            }
        });

        let priceObj = this.props.product.prices.filter(price => 
            price.currency.label === this.props.label)[0];

    return (
            <>  
                <div className='product-item-container'
                    onMouseOver={() => this.setState({
                        cartBtnAppear: true, cartBtnDisapp: false}
                    )}
                    onMouseLeave={() => this.setState({
                        cartBtnDisapp: true, cartBtnAppear: false}
                    )}>

                    <Link to={`/product/${this.props.product.id}`}>

                        <div className={`
                            product-item ${!this.props.product.inStock 
                            ? 'product-item-out' : ''}`}>
                                    
                            {image}

                            {!this.props.product.inStock && 
                                <img 
                                    src={outOfStockImg} 
                                    alt="out-of-stock" 
                                    className='product-item-img-out'
                                />
                            }
                                
                            <div className='product-item-name'>
                                {name}
                            </div>

                            <div className='product-item-brand'>
                                {brand}
                            </div>

                            <div className='product-item-price'>
                                <span>{priceObj.currency.symbol}</span>
                                <span>{priceObj.amount}</span>
                            </div>
                        </div>

                    </Link>
                    
                    {this.props.product.inStock &&
                        <div  
                            onClick={() => this.formProduct()}
                            className={`
                                product-item-cart-btn 

                                ${this.state.cartBtnAppear 
                                ? 'product-item-cart-btn-appear' 
                                : ''} 
                            
                                ${this.state.cartBtnDisapp 
                                ? 'product-item-cart-btn-disappear' 
                                : ''}`
                            }>
                            <img src={cartSign} alt="ADD"/>
                        </div >
                    }
                </div>
            </>
        )
    }
}
export default ProductItem;
