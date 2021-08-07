import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

// Components
import ScrollToTop from './ScrollToTop';

import Appservices from './Appservices';
import Contacthistory from './Contacthistory';
import Contacts from './Contacts';
import Giftcards from './Giftcards';
import Homerecordkeys from './Homerecordkeys';
import Homeswipemenu from './Homeswipemenu';
import Innerheader from './Innerheader';
import Landing from './Landing';
import Login from './Login';
import LoginHelp from './LoginHelp';
import Notifications from './Notifications';
import Persona from './Persona';
import Pricingplan from './Pricingplan';
import Privacypolicy from './Privacypolicy';
import Profileheader from './Profileheader';
import Referralheader from './Referralheader';
import Referrals from './Referrals';
import Register from './Register';
import Reports from './Reports';
import Shopping from './Shopping';
import Swapcoins from './Swapcoins';
import Termsandconditions from './Termsandconditions';
import Tokenoftrust from './Tokenoftrust';
import Trade from './Trade';
import Transactions from './Transactions';
import Viewcontact from './Viewcontact';
import Viewcontactheader from './Viewcontactheader';
import Wallet from './Wallet';


// import Swiper core and required components
import SwiperCore, { Pagination } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

import queryString from 'query-string'

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

// install Swiper components
SwiperCore.use([Pagination]);

class App extends React.Component {

	constructor(props) {

		super(props);

		this.state = store.getState();



		const value = queryString.parse(window.location.search);
		
		const token = value.invite;

		if (token && token !== '')
		{

			localStorage.setItem("invitecode", token);
			
		}


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

	componentDidMount(){
	
		this.unsubscribe = store.subscribe(() => {
		
			this.setState(store.getState());
			
		}); 

		if (localStorage.getItem("accessToken"))
		{

			store.dispatch( updateStore({ key: 'isLoggedIn', value: true }) );
			store.dispatch( updateStore({ key: 'accessToken', value: localStorage.getItem("accessToken") }) );
			store.dispatch( updateStore({ key: 'requestedPage', value: 'homepage' }) );
			store.dispatch( updateStore({ key: 'pageTitle', value: 'Home' }) );
			
			(async () => {

				let res = await userService.get();

				if (res.status === true)
				{
					
					// Only need websocket if user is logged in
					
					this.startWebsocket();
					
					store.dispatch( updateStore({ key: 'user', value: res.user }) );
					
					let resi = await userService.getimages();

					if (resi.status === true)
					{
						store.dispatch( updateStore({ key: 'userImages', value: resi.userimages }) );
					}
					
				}
				else
				{

					store.dispatch( updateStore({ key: 'isLoggedIn', value: false }) );
					store.dispatch( updateStore({ key: 'accessToken', value: null }) );
					store.dispatch( updateStore({ key: 'requestedPage', value: 'login' }) );
					store.dispatch( updateStore({ key: 'pageTitle', value: 'Login' }) );

					toast.error('Authentication Session Has Expired');
					
				}

		
				let res2 = await userService.getplans();
			
				if (res2.status === true)
				{
					store.dispatch( updateStore({ key: 'plans', value: res2.planlist }) );
				}

		
			})();

		}

		let darkmode = localStorage.getItem("darkmode");

		if (darkmode === true || darkmode === "true")
		{
			document.body.classList.add('darkmode');
			store.dispatch( updateStore({ key: 'darkmode', value: true }) );
			document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content='black';
		}
		else
		{
			document.body.classList.remove('darkmode');
			store.dispatch( updateStore({ key: 'darkmode', value: false }) );
			document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content='default';
		}
		
	}

    componentWillUnmount(){
        this.unsubscribe();     
	}


	startWebsocket() {

		var ws = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws/");

		// listen to onmessage event
		ws.onmessage = evt => { 
			// add the new message to state
			//console.log( "*" + evt.data + "*" )
		
			if (evt.data.toString() === 'newtx')
			{

				store.dispatch( updateStore({ key: 'wss', value: 'newtx' }) );
		
			}
		
		};

		ws.onopen = () => {
			 ws.send( 'sub:' + this.state.user._id );
		}

		ws.onclose = function(){
			// connection closed, discard old websocket and create a new one in 5s
			ws = null
			setTimeout(this.startWebsocket, 5000)
		}
  
	}

	render() {
	
		var isLoggedIn = this.state.isLoggedIn;
		var requestedPage = this.state.requestedPage;

		const noauthPages = ['landing', 'login', 'register', 'loginhelp'];

		if (isLoggedIn === false && noauthPages.indexOf(requestedPage) === -1)
		{
			store.dispatch( updateStore({ key: 'requestedPage', value: 'login' }) );
			store.dispatch( updateStore({ key: 'pageTitle', value: 'Login' }) );
			requestedPage = 'landing';
		}

		if (requestedPage === 'landing')
		{
			
			return (
				<ScrollToTop>
					<Landing />
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'login')
		{

			return (
				<ScrollToTop>
					<Login />
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'loginhelp')
		{

			return (
				<ScrollToTop>
					<LoginHelp />
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'register')
		{

			return (
				<ScrollToTop>
					<Register />
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'homepage')
		{

			return (
				<ScrollToTop>
				<Innerheader />
				<div className="main-container">
					<div className="container mb-4">
						<Homeswipemenu />
						<Homerecordkeys />
						<Pricingplan />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'reports')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Reports />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'transactions')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Transactions />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'wallet')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Wallet />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'contacts')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Contacts />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'viewcontact')
		{

			return (
				<ScrollToTop>
				<Viewcontactheader />
				<div className="main-container">
					<div className="container mb-4">
						<Viewcontact />
						<Contacthistory />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'giftcards')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Giftcards />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'shopping')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Shopping />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'trade')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Trade />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'profile')
		{

			return (
				<ScrollToTop>
				<Profileheader />
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Appservices />
					</div>
				</div>
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'persona')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Tokenoftrust />
						<Persona />
					</div>
				</div>
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'notifications')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Notifications />
					</div>
				</div>
				</ScrollToTop>
			);

		}

		else if (requestedPage === 'privacypolicy')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Privacypolicy />
						
					</div>
				</div>
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'termsandconditions')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Termsandconditions />
						
					</div>
				</div>
				</ScrollToTop>
			);

		}
		else if (requestedPage === 'pricingplan')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Pricingplan />
					</div>
				</div>
				</ScrollToTop>
			);


		}		
		else if (requestedPage === 'swapcoins')
		{

			return (
				<ScrollToTop>
				<div className="main-container">
					<div className="container mb-4">
						<Homerecordkeys />
						<Swapcoins />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		else if (requestedPage === 'referrals')
		{

			return (
				<ScrollToTop>
				<Referralheader />
				<div className="main-container">
					<div className="container mb-4">
						<Referrals />
					</div>
				</div>
				</ScrollToTop>
			);


		}
		
	}
	
}

export default App;
