import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  notification,
  Spin,
  Layout,
  Row,
  Col,
  Form,
  Input,
  Button,
} from 'antd';
import { loginUser } from '../../actions';
import messages from './messages';

class LoginPage extends Component {
  state = { email: '', password: '', loading: false };

  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };

  tailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 1 },
  };

  onFinish = values => {
    const { dispatch } = this.props;
    const { email, password } = this.state;

    this.setState({ loading: true });
    dispatch(loginUser(email, password));
  };

  onFinishFailed = errorInfo => {
    console.log(this.props.hasLoginError);
    this.setState({ loading: false });
    if (this.props.hasLoginError) {
      notification.error({
        message: 'Authorization error',
        description: this.props.loginError,
      });
    }
  };

  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
  };

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value });
  };

  render() {
    const { isAuthenticated } = this.props;
    const { Content } = Layout;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <Content>
        <Row align="middle" justify="center" style={{ height: '100vh' }}>
          <Col>
            <Spin tip={messages.preloader} spinning={this.state.loading}>
              <div
                style={{
                  textAlign: 'center',
                  minWidth: '350px',
                  border: '1px solid #eee',
                  backgroundColor: '#fff',
                  padding: '5vh 5vh 0',
                }}
              >
                <h1>
                  <FormattedMessage {...messages.header} />
                </h1>
                <Form
                  size="large"
                  layout="vertical"
                  name="signin"
                  onFinish={this.onFinish}
                  onFinishFailed={this.onFinishFailed}
                >
                  <Form.Item
                    label={messages.labels.username}
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: messages.rules.username,
                      },
                    ]}
                  >
                    <Input onChange={this.handleEmailChange} />
                  </Form.Item>

                  <Form.Item
                    label={messages.labels.password}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: messages.rules.password,
                      },
                    ]}
                  >
                    <Input.Password onChange={this.handlePasswordChange} />
                  </Form.Item>

                  <Form.Item {...this.tailLayout}>
                    <Button type="primary" htmlType="submit">
                      {messages.labels.submit}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Spin>
          </Col>
        </Row>
      </Content>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.hasLoginError != this.props.hasLoginError) {
      if (this.props.hasLoginError) {
        this.onFinishFailed(this.props.loginError);
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    hasLoginError: state.auth.loginError,
    loginError: state.auth.error.message,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(LoginPage);
