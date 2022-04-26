import React from 'react';
import { Component } from 'react';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CategSelection from './components/CategSelection';
import CurrencySwitch from './components/CurrencySwitch';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import CartMini from './components/CartMini';
import CartPage from './components/CartPage';
import logo from './images/logo.png';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
}); 

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryName: '',
            categoryNames: [],
            currency: {},
            currencies: [],
            productItems: [],

            productList: [],
            productsAmount: [],
        }

        this.setCategoryName = this.setCategoryName.bind(this);
        this.setCurrency = this.setCurrency.bind(this);
        this.setProductItems = this.setProductItems.bind(this);
        this.productListHandler = this.productListHandler.bind(this);
    }
    
    componentDidMount() {
        fetch('http://localhost:4000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query CategoriesQuery {
                    categories {
                        name
                    }
                    currencies {
                        label
                        symbol
                    }       
                }
                `
            }),
            })
        .then((res) => res.json())
        .then(({data}) => {
            this.setState({categoryNames: data.categories});
            this.setState({currencies: data.currencies});
            
            if (!sessionStorage.getItem('categoryName')) {
                this.setState({categoryName: data.categories[0].name});
            } else {
                this.setState({
                    categoryName: sessionStorage.getItem('categoryName')});
            }

            if (!sessionStorage.getItem('chosenCurrency')) {
                this.setState({currency: data.currencies[0]});
            } else {
                this.setState({currency: 
                    JSON.parse(sessionStorage.getItem('chosenCurrency'))});
            }
            
        });
        let cartData = JSON.parse(sessionStorage.getItem('cartData'));
        
        if (cartData) {
            let listString = cartData.productList.map(product => 
                JSON.stringify(product)
            );

            this.setState({
                productList: listString, 
                productsAmount: cartData.productsAmount}
            );
        }
    }

    componentDidUpdate() {
        let cartProds = [...this.state.productList].map(product => 
            JSON.parse(product)
        );

        let cartData = {
            productList: cartProds, 
            productsAmount:this.state.productsAmount
        }

        sessionStorage.setItem('cartData', JSON.stringify(cartData));
    }

    productListHandler(productObj, actionType){
        let product = JSON.stringify(productObj);
        let index = this.state.productList.indexOf(product);
        let length = this.state.productList.length;
        let amount = [...this.state.productsAmount];
        let list = [...this.state.productList];
        
        if (actionType === 'add') {
            if (index === -1) {
                amount[length] = 1; 
                this.setState({
                    productList: [...this.state.productList, product], 
                    productsAmount: amount}
                );
                
            } else {
                amount[index] += 1; 
                this.setState({productsAmount: amount});
            }
        }

        if (actionType === 'reduce') {
            if (amount[index] > 1) {
                amount[index] -= 1; 
                this.setState({productsAmount: amount});
            } else {
                this.productListHandler(productObj, 'delete');
            }
        }

        if (actionType === 'delete') {
            list.splice(index, 1, );
            amount.splice(index, 1, );
            
            this.setState({productList: list});
            this.setState({productsAmount: amount});
        } 
    }
    
    setCategoryName(name) {
        this.setState({categoryName: name})
    }

    setProductItems(items) {
        this.setState({productItems: items})
    }

    setCurrency(currency) {
        this.setState({currency: currency});
    }

    render() {
        return (
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <div className="navbar">
                            <CategSelection 
                                categoryName={this.state.categoryName}
                                categoryNames={this.state.categoryNames}
                                setCategoryName={this.setCategoryName}
                                setProductItems={this.setProductItems}
                            />
                            <img src={logo} alt="logo" className='navbar-logo'/>

                            <CurrencySwitch 
                                currency={this.state.currency}
                                currencies={this.state.currencies}
                                setCurrency={this.setCurrency}
                            />
                            
                            <CartMini
                                label={this.state.currency.label}
                                productList={this.state.productList}
                                productsAmount={this.state.productsAmount}
                                productListHandler={this.productListHandler}
                            />
                    </div>

                    <Routes>
                        <Route path='/' element={
                            <CategoryPage 
                                name={this.state.categoryName}
                                label={this.state.currency.label}
                                productItems={this.state.productItems}
                                setProductItems={this.setProductItems}
                                productListHandler={this.productListHandler}
                            />}>
                        </Route>

                        <Route path={`/product/:id`} element={
                            <ProductPage
                                label={this.state.currency.label}
                                productListHandler={this.productListHandler}
                            />}>
                        </Route> 

                        <Route path='/cart' element={
                            <>
                            <h1 className='cart-page-header'>Cart</h1>
                            <CartPage
                                class='cart-page'
                                isMiniCart={false}
                                label={this.state.currency.label}
                                productList={this.state.productList}
                                productsAmount={this.state.productsAmount}
                                productListHandler={this.productListHandler}
                            />
                            </>}>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ApolloProvider>
        );
    }
}
export default App;
