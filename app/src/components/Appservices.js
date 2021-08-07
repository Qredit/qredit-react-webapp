import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

// SubItems
import AppservicesLanguage from './AppservicesLanguage';
import AppservicesSecurity from './AppservicesSecurity';
import AppservicesBip from './AppservicesBip';
import Loginhistory from './Loginhistory';
import AppservicesPhone from './AppservicesPhone';
import AppservicesAddress from './AppservicesAddress';
import AppservicesNotifications from './AppservicesNotifications';
import AppservicesTwoFactor from './AppservicesTwoFactor';


class Appservices extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		store.dispatch( updateStore({ key: 'appservicesItem', value: null }) );
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	handleLogout = (e) => {
		e.preventDefault();
		
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

	setCurrentItem = (e, item) => {
	
		e.preventDefault();
		
		if (this.state.appservicesItem === item)
		{
			store.dispatch( updateStore({ key: 'appservicesItem', value: null }) );
		}
		else
		{
			store.dispatch( updateStore({ key: 'appservicesItem', value: item }) );
		}
		
	};
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{

			return (
                
				<div className="card mt-2">

                    <div className="card-header">
                        <h6 className="mb-0">Qredit Motion</h6>
                    </div>
                        <div className="hr-thin"></div>

                            <a onClick={ e => this.setCurrentPage(e, 'pricingplan', 'Pricing Plan') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/081-crown.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Priceplan</h6>
                                        <p className="text-secondary">Modify Subscription</p>
                                    </div>
                                </div>
                            </a>

                            <a onClick={ e => this.setCurrentPage(e, 'persona', 'Persona') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/006-user.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Persona / KYC</h6>
                                        <p className="text-secondary">Manage Persona</p>
                                    </div>
                                </div>
                            </a>

                    <div className="card-header">
                        <h6 className="mb-0">Personal</h6>
                    </div>
                        <div className="hr-thin"></div>

                            <a onClick={ e => this.setCurrentItem(e, 'notifications') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/005-bell.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Notification Settings</h6>
                                        <p className="text-secondary">Manage Notifications</p>
                                    </div>
                                </div>
                            </a>
							<AppservicesNotifications/>

                            <a onClick={ e => this.setCurrentItem(e, 'addresses') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/003-location.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">My Addresses</h6>
                                        <p className="text-secondary">Change Addresses</p>
                                    </div>
                                </div>
                            </a>
							<AppservicesAddress/>
							
                            <a onClick={ e => this.setCurrentItem(e, 'phones') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/057-phone.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">My Phone Numbers</h6>
                                        <p className="text-secondary">Manage phone Numbers</p>
                                    </div>
                                </div>
                            </a>
                            <AppservicesPhone/>

                            <a onClick={ e => this.setCurrentItem(e, 'language') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/095-megaphone.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Language</h6>
                                        <p className="text-secondary">Select Language</p>
                                    </div>
                                </div>
                            </a>
							<AppservicesLanguage/>

                    <div className="card-header">
                        <h6 className="mb-0">Advanced Features</h6>
                    </div>
                        <div className="hr-thin"></div>

                            <a onClick={ e => this.setCurrentPage(e, 'swapcoins', 'Swap Old XQR') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/088-transfer.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">XQR Swap</h6>
                                        <p className="text-secondary">Swap Old XQR</p>
                                    </div>
                                </div>
                            </a>

                    <div className="card-header">
                        <h6 className="mb-0">About</h6>
                    </div>
                        <div className="hr-thin"></div>

                            <a onClick={ e => this.setCurrentPage(e, 'privacypolicy', 'Privacy Policy') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/035-copy.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Privacy Policy</h6>
                                        <p className="text-secondary">View Privacy Policy</p>
                                    </div>
                                </div>
                            </a>

                            <a onClick={ e => this.setCurrentPage(e, 'termsandconditions', 'Terms and Conditions') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/036-paste.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Terms and Conditions</h6>
                                        <p className="text-secondary">View Terms and Conditions</p>
                                    </div>
                                </div>
                            </a>

                    <div className="card-header">
                        <h6 className="mb-0">Security</h6>
                    </div>
                        <div className="hr-thin"></div>

                            <a onClick={ e => this.setCurrentItem(e, 'security') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/082-shield.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Security Settings</h6>
                                        <p className="text-secondary">Password and Devices</p>
                                    </div>
                                </div>
                            </a>
                            <AppservicesSecurity/>

                            <a onClick={ e => this.setCurrentItem(e, 'twofactor') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/082-shield.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Two Factor Authentication</h6>
                                        <p className="text-secondary">Enable or disable</p>
                                    </div>
                                </div>
                            </a>
                            <AppservicesTwoFactor/>
                            
                            <a onClick={ e => this.setCurrentItem(e, 'loginhistory') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/045-eye.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Login History</h6>
                                        <p className="text-secondary">Account Login History</p>
                                    </div>
                                </div>
                            </a>
                            <Loginhistory />

                            <a onClick={ e => this.setCurrentItem(e, 'bip') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/052-unlock.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Get BIP39 Passphrase</h6>
                                        <p className="text-secondary">Unlock and View Passphrase</p>
                                    </div>
                                </div>
                            </a>
                            <AppservicesBip/>

                            <a onClick={ e => this.setCurrentItem(e, 'closeaccount') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2 circle bg-danger" style={{backgroundImage: 'url("/img/icons/essential/svg/016-cross.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Close Account</h6>
                                        <p className="text-secondary">Close Your Account</p>
                                    </div>
                                </div>
                            </a>
                            <a onClick={ e => this.handleLogout(e) } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{backgroundImage: 'url("/img/icons/essential/svg/033-power on.svg")'}} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Logout</h6>
                                        <p className="text-secondary">Logout from the application</p>
                                    </div>
                                </div>
                            </a>
                            
                            
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

export default Appservices;
