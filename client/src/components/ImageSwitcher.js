import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ImageSwitcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentImage: undefined,
            btnsDisplay: true,
            leftDisabled: true,
            rightDisabled: false
        }
    }

    static get propTypes() {
        return {
            images: PropTypes.arrayOf(PropTypes.string),
            name: PropTypes.string
        }
    }

    componentDidMount() {
        this.setState({currentImage: this.props.images[0]});

        if (this.props.images.length <= 1) {
            this.setState({btnsDisplay: false});
        }
    }

    slideImage(side) {
        let index = this.props.images.indexOf(this.state.currentImage);

        if (side === 'left' && index > 0) {
            this.setState({currentImage: this.props.images[--index]});
            
        } else if (side === 'right' 
            && index < this.props.images.length - 1) {
            this.setState({currentImage: this.props.images[++index]});
        }

        if (index === 0) {
            this.setState({leftDisabled: true});

        } else if (index === this.props.images.length - 1) {
            this.setState({rightDisabled: true});

        } else if (index > 0 && index < this.props.images.length - 1) {
            this.setState({leftDisabled: false, rightDisabled: false});
        }
    }
    
    render() {
        let leftBtn = React.createElement('div', {
            className: `image-switcher image-switcher-left 
            ${this.state.leftDisabled ? 'image-switcher-disabled' : ''}`,
            style: {display: `${this.state.btnsDisplay ? '' : 'none'}`},
            onClick: () => {
                this.slideImage('left');
            }
        }, ['<']);

        let rightBtn = React.createElement('div', {
            className: `image-switcher image-switcher-right 
            ${this.state.rightDisabled ? 'image-switcher-disabled' : ''}`,
            style: {display: `${this.state.btnsDisplay ? '' : 'none'}`},
            onClick: () => {
                this.slideImage('right');
            }
        }, ['>']);

        return (
            <div className='image-switcher-wrapper'>
                {leftBtn}
                <img src={this.state.currentImage} alt={this.props.name} />
                {rightBtn}
            </div>
        )
    }
}
export default ImageSwitcher;
