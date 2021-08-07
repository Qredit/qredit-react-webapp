import React from 'react';

import { toast } from 'react-toastify';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

// SERVICES
import userService from '../services/userService';

class Mainheader extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.notificationCount = 0;

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		
		if (this.state.isLoggedIn === true)
		{

			(async () => {

				let res = await userService.getnotificationcount();

				if (res.status === true)
				{
					this.setState({ notificationCount: res.count });
				}

			})();

		}


		
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }


	showMenu = (e) => {

		e.preventDefault();
		store.dispatch( updateStore({ key: 'showMenu', value: true }) );
	
	};

	toggleDarkMode = (e) => {

		e.preventDefault();
		if (this.state.darkmode && this.state.darkmode === true)
		{
			document.body.classList.remove('darkmode');
			store.dispatch( updateStore({ key: 'darkmode', value: false }) );
			document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content='default';
			localStorage.setItem("darkmode", false);
		}
		else
		{
			document.body.classList.add('darkmode');
			store.dispatch( updateStore({ key: 'darkmode', value: true }) );
			document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content='black';
			localStorage.setItem("darkmode", true);
		}
		
	};

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
		var pageTitle = ''; //this.state.pageTitle || '';

		if (isLoggedIn === true)
		{

			return (
					<div className="row">
						<div className="col-auto px-0">
							<button className="menu-btn btn btn-40 btn-link" type="button" onClick={ e => this.showMenu(e) }>
								<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/012-menu.svg")'}} />
							</button>
						</div>
						<div className="text-left col align-self-center mt-1">
								<h4>{this.state.pageTitle || ''}</h4>
						</div>
						<div className="ml-auto col-auto pl-0">
							<a onClick={ e => this.toggleDarkMode(e) } className="avatar avatar-30 shadow-sm rounded-circle ml-2">
								<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: (this.state.darkmode? 'url("/img/icons/essential/svg/021-sun.svg")':'url("/img/icons/essential/svg/022-moon.svg")')}}></figure>
							</a>
							<a onClick={ e => this.setCurrentPage(e, 'notifications', 'Notifications') } href="/" className="avatar avatar-30 shadow-sm rounded-circle ml-2">
								<figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/005-bell.svg")'}} />
								<span className="counter" style={(this.state.notificationCount>0?{}:{display:'none'})}></span>
							</a>
							<a onClick={ e => this.setCurrentPage(e, 'profile', 'Profile') } href="/" className="avatar avatar-30 shadow-sm rounded-circle ml-2">
								<figure className="m-0 background" style={{backgroundImage: (this.state.userImages && this.state.userImages.profilepic?'url(' + this.state.userImages.profilepic + ')':'url("/img/icons/essential/svg/006-user.svg")')}}></figure>
							</a>
						</div>
					</div>
			);

		}
		else if (requestedPage === 'login')
		{

			return (
            	<div className="row">
					<div className="col-auto px-0">
						<button onClick={ e => this.setCurrentPage(e, 'landing', 'Home') } className="btn btn-40 btn-link back-btn" type="button">
							<span className="material-icons">keyboard_arrow_left</span>
						</button>
					</div>
					<div className="text-left col align-self-center">

					</div>
					<div className="ml-auto col-auto align-self-center">
						<li onClick={ e => this.setCurrentPage(e, 'register', 'Register') } className="text-white lilink">
							Sign up
						</li>
					</div>
				</div>
			);

		}
		else if (requestedPage === 'register' || requestedPage === 'loginhelp')
		{
			return (
				<div className="row">
					<div className="col-auto px-0">
						<button onClick={ e => this.setCurrentPage(e, 'landing', 'Home') } className="btn btn-40 btn-link back-btn" type="button">
							<span className="material-icons">keyboard_arrow_left</span>
						</button>
					</div>
					<div className="text-left col align-self-center">

					</div>
					<div className="ml-auto col-auto align-self-center">
						<li onClick={ e => this.setCurrentPage(e, 'login', 'Login') } className="text-white lilink">
							Sign In
						</li>
					</div>
				</div>
			);
		}
		else
		{
			return (
				<div/>
			)

		}
		
	}
	
}

export default Mainheader;
