import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Viewcontact extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		//store.dispatch( updateStore({ key: 'appservicesItem', value: null }) );
		
		let contactid = this.state.requestedPageExtra;
		
		//(async () => {
		
		
		//})();
		
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

	setCurrentItem = (e, item) => {
	
		e.preventDefault();
		
		/*
		if (this.state.appservicesItem === item)
		{
			store.dispatch( updateStore({ key: 'appservicesItem', value: null }) );
		}
		else
		{
			store.dispatch( updateStore({ key: 'appservicesItem', value: item }) );
		}
		*/
		
	};
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{

			return (
				<div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Action Menu</h6>
                    </div>
                    <div className="card-body px-0 pt-0">
                        <div className="list-group list-group-flush border-top border-color">
                        
                            <a onClick={ e => this.setCurrentItem(e, '') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-50 bg-default-light text-default rounded">
                                            <span className="material-icons">call_made</span>
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Send</h6>
                                        <p className="text-secondary">Transfer funds to contact</p>
                                    </div>
                                </div>
                            </a>

                            <a onClick={ e => this.setCurrentItem(e, '') } href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="avatar avatar-50 bg-default-light text-default rounded">
                                            <span className="material-icons">call_received</span>
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0">
                                        <h6 className="mb-1">Receive</h6>
                                        <p className="text-secondary">Send transfer request to contact</p>
                                    </div>
                                </div>
                            </a>
                            
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

export default Viewcontact;
