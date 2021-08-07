import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Termsandconditions extends React.Component {

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
<div className="main-container">
  <div className="container mt-4 text-center">
    <h6 className="text-secondary mb-0">Terms and Conditions</h6>
    <h1 className="display-4 mb-0">Qredit Motion</h1>
  </div>

  <div className="container mt-4">
    <h4>Intro text</h4>
    <p className="text-secondary mt-3">
      subintro</p>
  </div>
  
  <div className="container my-4">
    <h4> Terms and Conditions</h4>
    <h6>1. Title</h6>
    <p className="text-secondary mt-3">The actual text.</p>
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

export default Termsandconditions;
