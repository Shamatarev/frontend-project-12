const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  signUpPath: () => [apiPath, 'signup'].join('/'),
  rootPage: '/',
  loginPage: '/login',
  signupPage: '/signup',
};

export default routes;
