import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import ProtectedRoute from 'components/ProtectedRoute/Loadable';
import LoginPage from 'pages/LoginPage/Loadable';
import CalendarPage from 'pages/CalendarPage/Loadable';
import NotFoundPage from 'pages/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

function App(props) {
  // eslint-disable-next-line react/prop-types
  const { isAuthenticated, isVerifying } = props;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={CalendarPage}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <Route path="/login" component={LoginPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(App);
