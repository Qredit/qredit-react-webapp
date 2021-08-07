import React, { Component } from 'react';
import autobind from 'react-autobind';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import updateStore from './store';
import toast from 'react-toastify';

import modules from './modules';

import Page404 from './components/Page404';
import Layout from './components/Layout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


/* from old motion */

// SERVICES
import userService from './services/userService';

// Components
// import ScrollToTop from './ScrollToTop';

// import Appservices from './Appservices';
// import Contacthistory from './Contacthistory';
// import Contacts from './Contacts';
// import Giftcards from './Giftcards';
// import Homerecordkeys from './Homerecordkeys';
// import Homeswipemenu from './Homeswipemenu';
// import Innerheader from './Innerheader';
// import Landing from './Landing';
// import Login from './Login';
// import LoginHelp from './LoginHelp';
// import Notifications from './Notifications';
// import Persona from './Persona';
// import Pricingplan from './Pricingplan';
// import Privacypolicy from './Privacypolicy';
// import Profileheader from './Profileheader';
// import Referralheader from './Referralheader';
// import Referrals from './Referrals';
// import Register from './Register';
// import Reports from './Reports';
// import Shopping from './Shopping';
// import Swapcoins from './Swapcoins';
// import Termsandconditions from './Termsandconditions';
// import Tokenoftrust from './Tokenoftrust';
// import Trade from './Trade';
// import Transactions from './Transactions';
// import Viewcontact from './Viewcontact';
// import Viewcontactheader from './Viewcontactheader';
// import Wallet from './Wallet';



export default class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this._routes = null;
  }

  renderRoutes() {
    if (this._routes) {
      return this._routes;
    }

    this._routes = Object.keys(modules).map((item) => (
      <Route key={`route_${item}`} exact path={item} component={withRouter(modules[item])} />
    ));

    return this._routes;
  }

  render() {
    const routes = this.renderRoutes();

    return (
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Switch>
              {routes}
              <Route component={Page404} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  }
}

