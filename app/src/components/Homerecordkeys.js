import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Homerecordkeys extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	doModalYes = () => {

		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		(async () => {

			let res = await userService.bip39recorded();

			if (res.status === true)
			{
				store.dispatch( updateStore({ key: 'user', value: res.user }) );
			}

		})();

	};

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
			let teststate = store.getState();
			if (teststate.modalButtonClick === true)
			{
				if (this.state.modalType === 'recordkeys')
				{
					this.doModalYes();
				}
				
			}
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

	handlePassFormChange = event => {

		store.dispatch( updateStore({ key: 'password', value: event.target.value }) );

	};

	doGetPassphrase = (e) => {

		e.preventDefault();

		(async () => {

			if (this.state.password)
			{
				let res = await userService.getpassphrase({password: this.state.password});

				if (res.status === true)
				{
				
					let passphrase = res.message;

					let phrasearray = passphrase.split(' ');

					if (phrasearray.length === 12)
					{
					
						this.setState({modalType: 'recordkeys'});

						let modaldata = '';

						for (let i = 0; i < phrasearray.length; i++)
						{
							modaldata += "<h5>Word #" + (i+1) + ":  <strong>" + phrasearray[i] + "</strong></h5>";
						}

						store.dispatch( updateStore({ key: 'modalData', value: modaldata }) );
						store.dispatch( updateStore({ key: 'modalButton', value: 'I Have Written Down' }) );
						store.dispatch( updateStore({ key: 'modalTitle', value: 'Your BIP39 Passphrase' }) );
						store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

						store.dispatch( updateStore({ key: 'password', value: null }) );

					}
					else
					{

						toast.error('Error Decrypting Passphrase.  Check Password');

					}

				}
				else
				{

					toast.error(res.message);

				}
			}

		})();

	};

	render() {
	
		const isLoggedIn = this.state.isLoggedIn;

		if (isLoggedIn === true && this.state.user && this.state.user.bip39_user_recorded === false)
		{

			return (
				<div className="card text-left mt-2">
					<div className="card-header">
						<h6 className="subtitle mb-0">
							<div className="avatar avatar-40 bg-primary-light text-primary rounded mr-2"><span className="material-icons vm">warning</span></div>
							Important Notice to Users
						</h6>
					</div>
					<div className="card-body ">
						By design, Qredit Motion <strong>DOES NOT</strong> have access to your ecrypted private keys stored on our system.  All keys are strongly encrypted using your login password.  We only store a Bcrypt hash of your password, which means we can not decrypt your keys without you providing the decryption password.  If you lose your login credentials, the <strong>ONLY</strong> way to restore access to your account is using your BIP39 passphrase.  Therefore, you should <strong>WRITE DOWN AND SAFELY STORE</strong> your passphrase before doing any activity on Qredit Motion.
						<br /><br />

						<div className="input-group mb-3">
							<input onChange={this.handlePassFormChange} type="password" autoComplete="new-password" className="form-control" placeholder="Password" aria-label="Password" value={this.state.password || ''} />
							<div className="input-group-append">
								<button onClick={ e => this.doGetPassphrase(e) } className="btn btn-outline-secondary" type="button">Get Phrase</button>
							</div>
						</div>
					
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

export default Homerecordkeys;
