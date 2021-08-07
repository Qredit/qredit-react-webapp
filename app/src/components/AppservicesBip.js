import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

// SERVICES
import userService from '../services/userService';


class AppservicesBip extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
			let teststate = store.getState();
			if (teststate.modalButtonClick === true)
			{
			
				if (this.state.modalType === 'bip39')
				{
					this.doModalYes();
				}
				
			}
		}); 
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	doModalYes = () => {

		//console.log('model button click');
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		(async () => {

			let res = await userService.bip39recorded();

			if (res.status === true)
			{
				store.dispatch( updateStore({ key: 'user', value: res.user }) );
			}

		})();

	};
	
	setLanguage = (e, language) => {
	
		e.preventDefault();
		
		let cuser = this.state.user;
		cuser.preferred_language = language;
		store.dispatch( updateStore({ key: 'user', value: cuser }) );
		
		(async () => {

			let res = await userService.setlanguage(language);

			if (res.status === true)
			{
			
				toast.success('Language Setting Updated');
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}

		})();
		
	};
	
	setShowItem = (show) => {
		
		this.setState({showitem: show});

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
					
						this.setState({modalType: 'bip39'});

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

		return (
			<CSSTransition in={this.state.appservicesItem === 'bip'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card text-left mt-2" style={this.state.showitem===true?{}:{display:'none'}}>
					<div className="card-header">
						<h6 className="subtitle mb-0">
							Unlock and View BIP39 Passphrase
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
				
			</CSSTransition>
		);


	}
	
}

export default AppservicesBip;