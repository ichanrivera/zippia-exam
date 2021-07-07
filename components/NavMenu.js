import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export default class NavMenu extends Component {
  state = { activeItem: 'home' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu inverted>
        <Menu.Item
          name='Zippia'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        />
      </Menu>
    );
  }
}
