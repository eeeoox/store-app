import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class CategSelection extends Component {
    static get propTypes() { 
        return { 
            categoryName: PropTypes.string,
            categoryNames: PropTypes.array,
            setCategoryName: PropTypes.func,
            setProductItems: PropTypes.func 
        }; 
    }    
    
    render() {
        let categories = '';

        if (this.props.categoryNames[0]) {
            categories = this.props.categoryNames.map(category => 
                
                <Link to='/' key={category.name} className='categ-item-link'>
                    <div 
                        className={
                            `categ-item 
                            ${category.name === this.props.categoryName 
                            ? 'categ-item-selected' 
                            : ''}`
                        }
                        onClick={() => {
                            this.props.setCategoryName(category.name);
                            this.props.setProductItems([]);
                            sessionStorage.setItem('categoryName', category.name);
                            }
                        }>{category.name}
                    </div>
                    
                </Link>
            )
        }
        
        return (
            <div className='categ-wrapper'>
                {categories}
            </div>
        )
    }
}
export default CategSelection;
