import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AttributeItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            classIfSelected: undefined,
            display: false,
            displayInitial: false,
        }
    }

    static get propTypes() {
        return {
            itemObj: PropTypes.object,
            inStock: PropTypes.bool,
            isCartAtrribute: PropTypes.bool,
            selectedAttrs: PropTypes.arrayOf(PropTypes.object),
            setSelectedAttrs: PropTypes.func
        }
    }

    componentDidUpdate() {
        if (this.props.inStock) {
            let selectedAttr = JSON.stringify(
                this.props.selectedAttrs.filter(attr => 
                    attr.id === this.props.itemObj.id
                )
            );
            let currentAttr  = JSON.stringify([this.props.itemObj]);
    
            if (selectedAttr === currentAttr && 
                this.state.displayInitial === false) {
                    
                if (this.props.itemObj.type === 'text') {
                    this.setState({
                        classIfSelected: 'attribute-item-selected-text',
                        displayInitial: true
                    });
                    
                } else if (this.props.itemObj.type === 'swatch') {
                    this.setState({
                        classIfSelected: 'attribute-item-selected-swatch',
                        displayInitial: true
                    });
                } 
            }
    
            if (selectedAttr === currentAttr && this.state.display === true) {
                
                if (this.props.itemObj.type === 'text') {
                    this.setState({
                        classIfSelected: 'attribute-item-selected-text',
                        display: false
                    });
                    
                } else if (this.props.itemObj.type === 'swatch') {
                    this.setState({
                        classIfSelected: 'attribute-item-selected-swatch',
                        display: false
                    });
                } 
            }
            
            if (selectedAttr != currentAttr && this.state.display === false) {
                this.setState({
                    classIfSelected: undefined,
                    display: true
                });
            }
        }
    }
    
    render() {
        let itemObj = this.props.itemObj;
        let value = '';
        let style = {};

        if (itemObj.type === 'text') {
            value = itemObj.items[0].value;

        } else if (itemObj.type === 'swatch') {
            style = {backgroundColor: itemObj.items[0].value}
        }

        return (
            <div 
                className={`
                ${itemObj.type === 'text' 
                ? 'attribute-item-text' 
                : 'attribute-item-swatch'}
                ${this.state.classIfSelected
                ? this.state.classIfSelected
                : ''}`}
                
                style={style}
                onClick={() => {
                    if (!this.props.isCartAtrribute) {
                        this.props.setSelectedAttrs(itemObj);
                        this.setState({display: true});
                    }
                }}>
                {value}
            </div>
        )
    }
}
export default AttributeItem;
