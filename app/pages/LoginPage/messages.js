/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.pages.LoginPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Welcome',
  },
  rules: {
    username: 'Please input your username!',
    password: 'Please input your password!',
  },
  preloader: 'Validating...',
  labels: {
    username: 'Login',
    password: 'Password',
    submit: 'Sign-in',
  },
});
