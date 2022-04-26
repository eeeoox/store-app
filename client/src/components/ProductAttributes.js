import React, { Component } from 'react';
import AttributeItem from './AttributeItem';
import PropTypes from 'prop-types';

class ProductAttributes extends Component {

    static get propTypes() {
        return {
            inStock: PropTypes.bool,
            attribute: PropTypes.object,
            selectedAttrs: PropTypes.arrayOf(PropTypes.object),
            class: PropTypes.string,
            setSelectedAttrs: PropTypes.func
        }
    }

    componentDidMount() {
        let initialAttr = {
            id: this.props.attribute.id, 
            type: this.props.attribute.type, 
            items: [this.props.attribute.items[0]]
        }
        this.props.setSelectedAttrs(initialAttr);
    }
    
    render() {
        let attrItems = this.props.attribute.items.map(item => {

            let itemObj = {
                id: this.props.attribute.id,
                type: this.props.attribute.type,
                items: [item]
            }

            return <AttributeItem 
                key={item.id} 
                itemObj={itemObj}
                inStock={this.props.inStock}
                selectedAttrs={this.props.selectedAttrs}
                setSelectedAttrs={this.props.setSelectedAttrs}
                >
            </AttributeItem>
        })
                
        return (
            <div className={`attribute-container 
                ${this.props.class ? this.props.class : ''}`}>
                
                <h4 className='product-page-header'>{this.props.attribute.id}:</h4>
                <div className='attributes-wrap'>{attrItems}</div>
            </div>
        )
    }
}
export default ProductAttributes;
