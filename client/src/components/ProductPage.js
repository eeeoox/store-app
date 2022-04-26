import React, { Component } from 'react';
import parse from 'html-react-parser';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProductAttributes from './ProductAttributes';

function defineLocation(Component) {
    return function WrappedComponent(props) {
      const location = useLocation();
      return <Component {...props} pathname={location.pathname}/>
    }
}

class ProductPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productData: undefined,
            mainImg: undefined,
            miniImgs: [],

            loadedImgs: 0,
            display: false,
            selectedAttrs: []
        }

        this.setSelectedAttrs = this.setSelectedAttrs.bind(this);
    }

    static get propTypes() { 
        return { 
            label: PropTypes.string,
            pathname: PropTypes.string,
            productListHandler: PropTypes.func
        }; 
    }    

    componentDidMount() {
        this.fetchProductData();
    }

    componentDidUpdate() {
        this.setImages();
    }

    fetchProductData() {
        if (this.state.productData === undefined) {

            let prodId = this.props.pathname.slice(9, );
    
            fetch('http://localhost:4000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query ProductData {
                        product(id: "${prodId}") {
                            id
                            name
                            inStock
                            gallery
                            description
                            attributes {
                                id
                                type
                                items {
                                    value
                                    id
                                }
                            }
                            prices {
                                currency {
                                    label
                                    symbol
                                }
                                amount
                            }
                            brand
                        }
                    }
                `
            })
        })
        .then(res => res.json())
        .then(result => {
            let product = result.data.product;
            let previous = JSON.stringify(this.state.productData);
            let current = JSON.stringify(product);

            if (previous != current) {
                this.setState({productData: product});
            }
        })}
    }

    setImages() {
        if (this.state.productData) {
            let images = this.state.productData.gallery.map(link => 
                React.createElement('img', {
                    key: link,
                    src: link, 
                    alt: 'product-image',
                    onLoad: () => {
                        let amount = this.state.loadedImgs + 1;
                        this.setState({loadedImgs: amount});
                    }
                })
            )

            if (this.state.miniImgs[0] === undefined) {
                let wrappedImgs = images.map(image => 
                    <div 
                        key={image.key} 
                        className='product-page-mini-wrap'
                        onClick={() => this.setState({mainImg: image})}>
                        {image}
                    </div>
                )
                this.setState({miniImgs: wrappedImgs, mainImg: images[0]});
            }
        
            if (images.length === this.state.loadedImgs && 
                this.state.display === false) {

                this.setState({display: true});
            }
        }
    }

    setSelectedAttrs(attribute) {
        let attributes = this.state.selectedAttrs; 
        let index = -1;

        if (this.state.selectedAttrs[0]) {
            this.state.selectedAttrs.forEach(selectedAttr => {
                if (selectedAttr.id === attribute.id) {
                    index = this.state.selectedAttrs.indexOf(selectedAttr);
                }
            })
        }

        if (index === -1) {
            attributes.push(attribute)
        } else {
            attributes.splice(index, 1, attribute)
        }

        this.setState({selectedAttrs: attributes})
    }

    formProduct() {
        let {brand, gallery, id, name, prices} = this.state.productData;
        
        let product = {
            id: id, 
            name: name,
            images: gallery, 
            attributes: this.state.selectedAttrs, 
            prices: prices, 
            brand: brand
        }

        this.props.productListHandler(product, 'add');
    }
        
    render() {
        let attrFields = undefined;

        if (this.state.productData) {
            attrFields = this.state.productData.attributes.map(attribute => 
                <ProductAttributes 
                    key={attribute.id}
                    inStock={this.state.productData.inStock}
                    attribute={attribute}
                    selectedAttrs={this.state.selectedAttrs}
                    setSelectedAttrs={this.setSelectedAttrs}
                />    
            )
        }
        
        let priceObj = {}

        if (this.state.productData) {
            priceObj = this.state.productData.prices.filter(price => 
                price.currency.label === this.props.label
            );
        }

        return (
        <>{this.state.productData &&
            <div style={{display: `${this.state.display ? '' : 'none'}`}}>
                <div className='product-page'>
                    <div className="product-page-mini-images">
                        {this.state.miniImgs}
                    </div>
                    
                    <div className="product-page-main-image">
                        {this.state.mainImg}
                    </div>

                    <div className="product-page-data">
                        <h2 className='product-page-data-name'>
                            {this.state.productData.brand}
                        </h2>

                        <h2 className='product-page-data-brand'>
                            {this.state.productData.name}
                        </h2>
                        
                        {!this.state.productData.inStock &&
                        <p className='product-page-out-of-stock'>
                            ( out of stock )
                        </p>}
                    
                        <div className={`data-wrapper 
                            ${!this.state.productData.inStock && 
                            'data-wrapper-disabled'}`}>
                            
                            <div className="product-page-attributes">
                                {attrFields}
                            </div>
                    
                            {priceObj[0] && 
                                <div className="product-page-price">
                                    <h4 className='product-page-header'>
                                        Price:
                                    </h4>
                                    <div>{priceObj[0].currency.symbol}</div>
                                    <div>{priceObj[0].amount}</div>
                                </div>
                            }
                    
                            <button className='product-page-add-btn'
                                onClick={() => this.formProduct()}>
                                ADD TO CART
                            </button>
                        </div>
                    
                        <div className="product-page-description">
                            {parse(this.state.productData.description)}
                        </div>
                    </div>
                </div>
            </div>
        }</>)
    }
}

export default defineLocation(ProductPage);
