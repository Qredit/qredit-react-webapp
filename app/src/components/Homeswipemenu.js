import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// SERVICES
import userService from '../services/userService';

// install Swiper components
//SwiperCore.use([Pagination]);

class Homeswipemenu extends React.Component {

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


		if (isLoggedIn === true && this.state.user && this.state.user.bip39_user_recorded === true && this.state.user.pricingplan)
		{

			return (

<div className="card bg-blocks text-center">			
  <div className="row justify-content-equal no-gutters">
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'wallet', 'Wallet') } href="/" className="icon icon-40 mb-1 text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/009-plus.svg")'}} />
</a>
      <p className="text-secondary"><small>Add Funds</small></p>
    </div>
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'wallet', 'Wallet') } href="/" className="icon icon-40 mb-1 text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/030-send.svg")'}} /></a>
      <p className="text-secondary"><small>Transfer</small></p>
    </div>
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'wallet', 'Wallet') } href="/" className="icon icon-40 mb-1 text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/015-check.svg")'}} /></a>
      <p className="text-secondary"><small>Receive</small></p>
    </div>
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'trade', 'Trade') } href="/" className="icon icon-40 mb-1 text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/088-transfer.svg")'}} /></a>
      <p className="text-secondary"><small>Exchange</small></p>
    </div>
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'contacts', 'Contacts') } href="/" className="icon icon-40 mb-1 bg-icons text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/006-user.svg")'}} /></a>
      <p className="text-secondary"><small>Contacts</small></p>
    </div>
    <div className="col-4 col-md-2 mb-3">
	<a onClick={ e => this.setCurrentPage(e, 'transactions', 'Transactions') } href="/" className="icon icon-40 mb-1 text-default"><figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/031-search.svg")'}} /></a>
      <p className="text-secondary"><small>History</small></p>
    </div>
  </div>
 
   <div className="row my-3 justify-content-center">
	<div className="col-10 col-md-4 mx-auto"><img style={{maxWidth: 250}} src="img/qreditcard-max.png" /></div>
	</div>
	<p className="text-muted">Pre-subscribe to the Extreme Plan and Secure yourself a Qredit Visa Card Founders Edition</p>
	<ul className="nav nav-pills justify-content-center mb-4">
		<li className="nav-item"><a onClick={ e => this.setCurrentPage(e, 'pricingplan', 'Pricing Plan') } href="/" className="nav-link active">
	<div><span className="material-icons icon" />View Subscription</div>
	</a>
	</li>
	</ul>


	<p className="text-muted">Qredit Motion Beta - v1.2</p>
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

export default Homeswipemenu;
