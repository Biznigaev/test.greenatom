import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notification, Button } from 'antd';
import messages from './messages';
import { logoutUser } from '../../actions';

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      logoutError: false,
    };
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  };

  showNotifier = () => {
    notification.error({
      message: 'Logout error',
      description: 'Failed to log out. Try again',
    });
  };

  render() {
    const { username } = this.props;

    return (
      <div>
        <span style={{ marginRight: '5vh' }}>{username}</span>
        <span>
          <Button onClick={this.handleLogout}>{messages.button_text}</Button>
        </span>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.logoutError !== this.props.logoutError) {
      if (this.props.logoutError) {
        this.showNotifier();
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    username: state.auth.user.displayName || state.auth.user.email,
    logoutError: state.auth.logoutError,
  };
}

export default connect(mapStateToProps)(UserPanel);
