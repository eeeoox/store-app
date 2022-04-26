import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductItem from './ProductItem';

class CategoryPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loadedImgs: 0,
            display: false
        }
        this.countLoadedImgs = this.countLoadedImgs.bind(this);
    }

    static get propTypes() {
        return {
            name: PropTypes.string,
            label: PropTypes.string,
            productItems: PropTypes.arrayOf(PropTypes.object),
            setProductItems: PropTypes.func,
            productListHandler: PropTypes.func
        }
    }

    componentDidMount() {
        this.fetchProductsData();
        this.showContent();
    }

    componentDidUpdate() {
        this.fetchProductsData();
        this.showContent();
    }

    fetchProductsData() {
        if (this.props.label != undefined && 
            this.props.productItems[0] === undefined) {
            
            let categName = this.props.name;
    
            fetch('http://localhost:4000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query CategProductsQuery {
                        category(input: {title: "${categName}"}) {
                            name
                            products {
                            id
                            name
                            inStock
                            gallery
                            prices {
                                currency {
                                    label
                                    symbol
                                }
                                amount
                            }
                            attributes {
                                id
                                type
                                items {
                                    id
                                    value
                                }
                            }
                            brand
                            }
                        }
                    }
                `
            })
        })
        .then(res => res.json())
        .then(result => {
            let products = result.data.category.products;
            let previous = JSON.stringify(this.props.productItems);
            let current = JSON.stringify(products);

            if (previous != current) {
                this.props.setProductItems(products);
            }
        })}
    }

    showContent() {
        if (this.props.productItems.length != 0 && 
            this.state.loadedImgs === this.props.productItems.length) {
            this.setState({loadedImgs: 0, display: true})
        }
    }

    countLoadedImgs(amount) {
        this.setState({loadedImgs: amount});
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    render() {
        let emptyItems = this.props.productItems.map(product => 
            <div key={product.id} className='product-item-epmty'></div>
        )
        let productItems ='';

        if (this.props.productItems[0]) {
            productItems = this.props.productItems.map(product =>
                <ProductItem 
                    key={product.id} 
                    product={product} 
                    label={this.props.label} 
                    loadedImgs={this.state.loadedImgs}
                    countLoadedImgs={this.countLoadedImgs}
                    productListHandler={this.props.productListHandler}
                />
            )
        }

        return (
            <>
                <div className='products-header'>
                    {this.capitalizeFirstLetter(this.props.name)}
                </div>

                <div 
                    className={`products-container`} 
                    style={{display: `${this.state.display 
                    ? 'none' : ''}`}}>
                    {emptyItems}
                </div>

                <div 
                    className={
                    `products-container 
                    ${this.state.display 
                    ? '' : 'products-container-invisible'}`}>
                    {productItems}
                </div>
            </>
        )
    }
}
export default CategoryPage;
