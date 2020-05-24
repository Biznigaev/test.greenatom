import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import ProtectedRoute from 'components/ProtectedRoute/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import CalendarPage from 'containers/CalendarPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

function App(props) {
  // eslint-disable-next-line react/prop-types
  const { isAuthenticated, isVerifying } = props;

  return (
    <>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={CalendarPage}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <Route path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </>
  );
}

export default connect(mapStateToProps)(App);
