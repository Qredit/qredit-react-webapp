import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

// SERVICES
import userService from '../services/userService';


class AppservicesNotifications extends React.Component {

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
    
	setNotification = (e, item) => {
	
		e.preventDefault();

		let cuser = this.state.user;
		let notiuser = this.state.user.notifications || {};
		
		if (notiuser[item])
		{
			notiuser[item] = !notiuser[item];
		}
		else
		{
			notiuser[item] = true;
		}
		cuser.notifications = notiuser;
		store.dispatch( updateStore({ key: 'user', value: cuser }) );
		
		(async () => {

			let res = await userService.setnotification(item, notiuser[item]);

			if (res.status === true)
			{
			
				toast.success('Notification Setting Updated');
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
	
	
	render() {

		var currentsettings =  this.state.user.notifications || {};


		return (
			<CSSTransition in={this.state.appservicesItem === 'notifications'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card-body pt-0 px-0 mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
					<ul className="list-group list-group-flush ml-4">
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setNotification(e, 'newtx') } style={{cursor:'pointer'}}>
								<input type="radio" name="newtx" className="custom-control-input" readOnly checked={(this.state.user&&currentsettings.newtx===true?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch1">New Transactions</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setNotification(e, 'newcontact') } style={{cursor:'pointer'}}>
								<input type="radio" name="newcontact" className="custom-control-input" readOnly checked={(this.state.user&&currentsettings.newcontact===true?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch2">Contact Requests</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setNotification(e, 'refsignup') } style={{cursor:'pointer'}}>
								<input type="radio" name="refsignup" className="custom-control-input" readOnly checked={(this.state.user&&currentsettings.refsignup===true?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch2">Referral Signups</label>
							</div>
						</li>
					</ul>
				</div>

			</CSSTransition>
		);


	}
	
}

export default AppservicesNotifications;