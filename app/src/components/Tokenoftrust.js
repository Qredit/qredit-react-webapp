import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Tokenoftrust extends React.Component {

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
	
	getToken = (e) => {
	
		e.preventDefault();



		// get tot token
		(async () => {

console.log('test');

			let res = await userService.gettottoken();

console.log(res);

			if (res.status === true)
			{
				this.setState({tottoken: res.token});
			}
			
		})();
	
	};

	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{
		
			if (this.state.user && (this.state.user.pricingplan === 'elite' || this.state.user.pricingplan === 'extreme'))
			{
			
				if (this.state.tottoken && this.state.tottoken != '')
				{
					setTimeout(function() {
						window.tot('embedsInitialize');
					}, 10);
				}
			
				return (
					<div className="card mt-2">
						<div className="card-header">
							<h6 className="mb-0">Token of Trust KYC</h6>
						</div>

						<div className="card-body pt-0 px-0 mb-4">	
							{this.state.tottoken && this.state.tottoken != ''? (
							<div data-tot-widget="accountConnector" data-tot-access-token={this.state.tottoken || ''}></div>
							) : (
							<center><button onClick={ e => this.getToken(e) } className='btn btn-success'>Start KYC</button></center>
							)}
						</div>
					</div>
				);
			
			}
			else
			{

				return (
					<div className="card mt-2">
						<div className="card-header">
							<h6 className="mb-0">Token of Trust KYC</h6>
						</div>

						<div className="card-body pt-0 px-0 mb-4">	
							<center>You are not currently on a plan that requires KYC</center>
						</div>
					</div>
				);
			
			}

		}
		else
		{

			return (
				<div />
			);

		}
	}
	
}

export default Tokenoftrust;
