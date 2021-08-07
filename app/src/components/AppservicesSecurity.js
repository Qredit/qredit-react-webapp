import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

// SERVICES
import userService from '../services/userService';


class AppservicesSecurity extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.passForm = {};

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }
    
	updatePassword = (e) => {
	
		e.preventDefault();
		
		if (this.state.passForm.new_password !== this.state.passForm.confirm_password)
		{
		
			toast.error("Error:  New passwords do not match");
		
		}
		else
		{
		
			this.setState({passForm:{}});
			
			(async () => {

				let data = {
				  password: this.state.passForm.current_password,
				  newpass: this.state.passForm.new_password
				};
	
				let res = await userService.changepassword(data);

				if (res.status === true)
				{
					toast.success(res.message);
				}
				else
				{
					toast.error(res.message);
				}

			})();
		
		}
		
	};

	logoutAllDevices = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let res = await userService.invalidatesessions();

			if (res.status === true)
			{
			
				localStorage.removeItem("accessToken");
				store.dispatch( updateStore({ key: 'showMenu', value: false }) );
				store.dispatch( updateStore({ key: 'isLoggedIn', value: false }) );
				store.dispatch( updateStore({ key: 'accessToken', value: null }) );
				store.dispatch( updateStore({ key: 'requestedPage', value: 'login' }) );
		
				toast.success(res.message);
				
			}
			else
			{
				toast.error(res.message);
			}

		})();		
	};
	
	handlePassFormChange = event => {
	
		var currentPassForm = this.state.passForm;
		
		currentPassForm[event.target.id] = event.target.value;

		this.setState({passForm:currentPassForm});
		
	};
	
	setShowItem = (show) => {
		
		this.setState({showitem: show});

	};
	
	
	render() {

		return (
			<CSSTransition in={this.state.appservicesItem === 'security'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
                    <div className="card-header">
                        <h6 className="subtitle mb-0">
                            Change Password
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (this.state.passForm.current_password?'active':'')} autoComplete="new-password" id="current_password" onChange={this.handlePassFormChange} value={this.state.passForm.current_password || ''}/>
                            <label className="form-control-label">Current Password</label>
                        </div>
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (this.state.passForm.current_password?'active':'')} autoComplete="new-password" id="new_password" onChange={this.handlePassFormChange} value={this.state.passForm.new_password || ''}/>
                            <label className="form-control-label">New Password</label>
                        </div>
                        <div className="form-group float-label">
                            <input type="password" className={"form-control " + (this.state.passForm.current_password?'active':'')} autoComplete="new-password" id="confirm_password" onChange={this.handlePassFormChange} value={this.state.passForm.confirm_password || ''}/>
                            <label className="form-control-label">Confirm New Password</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-block btn-default rounded" onClick={ e => this.updatePassword(e) }>Update Password</button>
                    	<p className="text-center text-secondary">Changing password requires decryption and re-encryption of your BIP39 passphrase.  Please ensure you have stored your passphrase in a secure location prior to this action.</p>

						<button className="btn btn-block btn-danger rounded mt-3" onClick={ e => this.logoutAllDevices(e) }>Logout from all devices</button>
						<p className="text-center text-secondary mb-3">X devices and Apps runing on this account. We suggest to logout
                    		from any other devices to avoid unrevokable situations.</p>
                    		
                    </div>


				</div>
				
			</CSSTransition>
		);


	}
	
}

export default AppservicesSecurity;