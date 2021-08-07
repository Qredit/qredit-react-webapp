import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

class Mainfooter extends React.Component {

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
	
		var isLoggedIn = this.state.isLoggedIn;
		var requestedPage = this.state.requestedPage;
		
		if (requestedPage === 'landing')
		{
			return (
				<div className="row justify-content-center">
					<div className="col-6">
						<li onClick={ e => this.setCurrentPage(e, 'login', 'Login') } className="btn btn-default rounded btn-block lilink">Login</li>
					</div>
					<div className="col-6">
						<li onClick={ e => this.setCurrentPage(e, 'register', 'Register') } className="btn btn-outline-default rounded btn-block lilink">Register</li>
					</div>
				</div>
			);

		}
		else if (isLoggedIn === true)
		{
			return (
				<div className="row no-gutters justify-content-center">
					<div className="col-2">
						<a onClick={ e => this.setCurrentPage(e, 'homepage', 'Home') } href="/" className={(['homepage'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/064-home.svg")'}} />
						</a>
					</div>
					<div className="col-2">
						<a onClick={ e => this.setCurrentPage(e, 'transactions', 'Transactions') } href="/" className={(['transactions'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/045-eye.svg")'}} />
						</a>
					</div>
					<div className="col-2">
						<a onClick={ e => this.setCurrentPage(e, 'wallet', 'Wallet') } href="/" className={(['wallet','trade','transactions'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/017-credit card.svg")'}} />
						</a>
					</div>
					<div className="col-2">
						<a onClick={ e => this.setCurrentPage(e, 'contacts', 'Contacts') } href="/" className={(['contacts', 'viewcontact'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/006-user.svg")'}} />
						</a>
					</div>
					<div className="col-2 display-none">
						<a onClick={ e => this.setCurrentPage(e, 'shopping', 'Shopping') } href="/" className={(['shopping','giftcards'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/069-shopping cart.svg")'}} />
						</a>
					</div>
					<div className="col-2">
						<a onClick={ e => this.setCurrentPage(e, 'profile', 'Profile') } href="/" className={(['profile','referrals','persona','notifications'].indexOf(requestedPage)!==-1?'active':'')}>
							<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/001-gear.svg")'}} />
						</a>
					</div>
				</div>
			);
		}
		else
		{
			return (
				<div/>
			);
		}
	}
	
}

export default Mainfooter;
