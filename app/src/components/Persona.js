import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Persona extends React.Component {

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

	toggleItem = (e, item) => {
	
		e.preventDefault();
		
		let defaultpersona = {
				reputationreport: false,
				profilereview: false,
				starrating: false,
				profilecomments: false,
				txvolume: false,
				addressdiscovery: false,
				mobilediscovery: false,
				emaildiscovery: false
			};
		
		let currentsettings = this.state.user.persona || defaultpersona;
		
		if (currentsettings[item] === true)
		{
			
			currentsettings[item] = false;
			
		}
		else
		{
		
			currentsettings[item] = true;
		
		}
		
		let user = this.state.user;
		user['persona'] = currentsettings;
		
		store.dispatch( updateStore({ key: 'user', value: user }) );

		(async () => {

			await userService.savepersonasettings(currentsettings);
			
		})();
	}
		
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{

			return (
				<div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Persona Settings</h6>
                    </div>

					<div className="card-body pt-0 px-0 mb-4">
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'reputationreport') } style={{cursor:'pointer'}}>
									<input type="radio" name="reputationreport" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.reputationreport===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Reputation Report</h6><p class="text-secondary">Users can see your KYC Reputation Report</p></label>
								</div>
							</li>

							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'profilereview') } style={{cursor:'pointer'}}>
									<input type="radio" name="profilereview" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.profilereview===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Profile Review</h6><p class="text-secondary">Users can see your profile</p></label>
								</div>
							</li>

							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'starrating') } style={{cursor:'pointer'}}>
									<input type="radio" name="starrating" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.starrating===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Star Rating</h6><p class="text-secondary">Users can see your star rating</p></label>
								</div>
							</li>

							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'profilecomments') } style={{cursor:'pointer'}}>
									<input type="radio" name="profilecomments" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.profilecomments===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable profile comments</h6><p class="text-secondary">Users can comment on your profile</p></label>
								</div>
							</li>
							
							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'txvolume') } style={{cursor:'pointer'}}>
									<input type="radio" name="txvolume" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.txvolume===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Transaction Volume</h6><p class="text-secondary">Users can see the transaction volume of your account</p></label>
								</div>
							</li>
							
							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'addressdiscovery') } style={{cursor:'pointer'}}>
									<input type="radio" name="addressdiscovery" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.addressdiscovery===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Address Discovery</h6><p class="text-secondary">Users can find you by btc or crypto address</p></label>
								</div>
							</li>

							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'mobilediscovery') } style={{cursor:'pointer'}}>
									<input type="radio" name="mobilediscovery" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.mobilediscovery===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Mobile Discovery</h6><p class="text-secondary">Users can find you by phone number</p></label>
								</div>
							</li>

							<li className="list-group-item">
								<div className="custom-control custom-switch" onClick={ e => this.toggleItem(e, 'emaildiscovery') } style={{cursor:'pointer'}}>
									<input type="radio" name="emaildiscovery" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.persona&&this.state.user.persona.emaildiscovery===true?'checked':'')}/>
									<label className="custom-control-label" htmlFor="customSwitch1"><h6 style={{marginTop:'0.15em'}}>Enable Email Discovery</h6><p class="text-secondary">Users can find you by email address</p></label>
								</div>
							</li>
							
						</ul>
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

export default Persona;
