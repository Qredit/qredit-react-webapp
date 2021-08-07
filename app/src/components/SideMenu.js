import React from 'react';
import { toast } from 'react-toastify';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

import { slide as Menu } from 'react-burger-menu'

// SERVICES
import userService from '../services/userService';

class SideMenu extends React.Component {

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

	handleOnClose = () => {
		store.dispatch( updateStore({ key: 'showMenu', value: false }) );
	};

	handleLogout = () => {

		(async () => {

			let res = await userService.logout();
			
			localStorage.removeItem("accessToken");
		
			store.dispatch( updateStore({ key: 'showMenu', value: false }) );
			store.dispatch( updateStore({ key: 'isLoggedIn', value: false }) );
			store.dispatch( updateStore({ key: 'accessToken', value: null }) );
			store.dispatch( updateStore({ key: 'requestedPage', value: 'login' }) );
		
			toast.success('Sucessfully Logged Out');

		})();
		
	};
	
	setCurrentPage = (e, page, pagetitle = '') => {
		e.preventDefault();
		store.dispatch( updateStore({ key: 'requestedPage', value: page }) );
		store.dispatch( updateStore({ key: 'pageTitle', value: pagetitle }) );
		store.dispatch( updateStore({ key: 'showMenu', value: false }) );

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
		const requestedPage = this.state.requestedPage;
		
		if (isLoggedIn === true)
		{
		
			var showMenu = false;
			if (this.state.showMenu)
			{
				showMenu = this.state.showMenu;
			}

			return (
				<Menu disableAutoFocus width={ '280px' } isOpen={ showMenu } onClose={ this.handleOnClose } className={"main-menu"} itemListElement="div" customBurgerIcon={ false } customCrossIcon={ false }>
					
					<div className="col mb-4 align-self-center">
							<li className="navbar-brand">
								<img alt='' src="/img/qredit-wide2.png" style={{height: '30px', marginLeft: '-15px', marginTop: '-5px'}} />
							</li>
						</div>
					<div>
						<div className="row mb-4 no-gutters">
						<div className="col-auto"><button className="btn btn-link btn-40 btn-close text-white" onClick={ this.handleOnClose }><figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/016-cross.svg")', maxWidth: 20}} /></button></div>
						<div className="col-auto">
							<div className="avatar avatar-40 rounded-circle position-relative">
								<figure className="background" style={{backgroundImage: (this.state.userImages && this.state.userImages.profilepic?'url(' + this.state.userImages.profilepic + ')':'url("/img/user1.png")')}}></figure>
							</div>
						</div>
						<div className="col pl-3 text-left align-self-center">
							<h6 className="mb-1">{this.state.user?this.state.user.givenname:''} {this.state.user?this.state.user.familyname:''}</h6>
							<p className="small text-default-secondary">{this.state.user?this.state.user.residence_country:''}</p>
						</div>
						</div>
					</div>
					<div className="menu-container">
						<ul className="nav nav-pills flex-column ">
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'homepage', 'Home') } href="/" className={"nav-link " + (['homepage'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/064-home.svg")', maxWidth: 20}} />
										Home
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'transactions', 'Transactions') } href="/" className={"nav-link " + (['analytics'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
									<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/088-transfer.svg")', maxWidth: 20}} />
										Transactions
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'wallet', 'Wallet') } href="/" className={"nav-link " + (['wallet'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/078-wallet.svg")', maxWidth: 20}} />
										Wallet
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'contacts', 'Contacts') } href="/" className={"nav-link " + (['contacts'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/006-user.svg")', maxWidth: 20}} />
										Contacts
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item display-none">
								<a onClick={ e => this.setCurrentPage(e, 'shopping', 'Shopping') } href="/" className={"nav-link " + (['shopping'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/069-shopping cart.svg")', maxWidth: 20}} />
										Shopping
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'trade', 'Trade') } href="/" className={"nav-link " + (['trade'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/056-usage.svg")', maxWidth: 20}} />
										Trade
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							<li className="nav-item">
								<a onClick={ e => this.setCurrentPage(e, 'profile', 'Profile') } href="/" className={"nav-link " + (['profile','referrals','persona','notifications'].indexOf(requestedPage)!==-1?'active':'')}>
									<div>
										<figure className="background icon icon-20 mb-1 mr-2" style={{backgroundImage: 'url("/img/icons/essential/svg/001-gear.svg")', maxWidth: 20}} />
										Profile/Settings
									</div>
									<span className="arrow material-icons">chevron_right</span>
								</a>
							</li>
							
						</ul>
						<div className="text-center">
							<li className="btn btn-outline-danger text-white rounded my-3 mx-auto lilink" onClick={ this.handleLogout }>Sign out</li>
						</div>
					</div>
				</Menu>
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

export default SideMenu;
