import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Innerheader extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	setCurrentPage = (e, page, pagetitle = '') => {
		e.preventDefault();
		store.dispatch( updateStore({ key: 'requestedPage', value: page }) );
		store.dispatch( updateStore({ key: 'pageTitle', value: pagetitle }) );
		
		if (this.state.isLoggedIn === true)
		{

			(async () => {

				let res = await userService.get();

				if (res.status === true)
				{
					store.dispatch( updateStore({ key: 'user', value: res.user }) );
				}
				else
				{

					store.dispatch( updateStore({ key: 'isLoggedIn', value: false }) );
					store.dispatch( updateStore({ key: 'accessToken', value: null }) );
					store.dispatch( updateStore({ key: 'requestedPage', value: 'login' }) );
					store.dispatch( updateStore({ key: 'pageTitle', value: 'Login' }) );
					
					toast.error('Authentication Session Has Expired');

				}

			})();

		}

	};

	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{

			return (
			
<div className="card bg-blocks text-center ">
  <div className="row">
    <div className="col text-center">
      <h5 className="subtitle">Hi {this.state.user?this.state.user.givenname:''}!</h5>
      <p className="text-secondary">How are you doing today?</p>
    </div>
  </div>
  <div className="row text-center mt-3">
    <div className="col-6 col-md-6">
      <div className="card border-0 mb-4">
        <div className="card-body">
          <h3 className="mt-3 mb-0 font-weight-normal">€ {this.state.user?parseFloat(this.state.user.cash_balance).toFixed(2):0.00}</h3>
          <p className="text-secondary small">Cash Balance</p>
        </div>
      </div>
    </div>
    <div className="col-6 col-md-6">
      <div className="card border-0 mb-4">
        <div className="card-body">
          <h3 className="mt-3 mb-0 font-weight-normal">€ {this.state.user?parseFloat(this.state.user.crypto_balance).toFixed(2):0.00}</h3>
          <p className="text-secondary small">Crypto Value</p>
        </div>
      </div>
    </div>
  </div>
  <div className="container">
  	<div className="hr-thin mb-4"></div>
  </div>
  
</div>

	

						
			);

		}
		else
		{

			return (
				<div />
			);

		}
	}
	
}

export default Innerheader;
