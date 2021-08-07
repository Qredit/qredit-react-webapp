import React from 'react';
import ImageUploader from 'react-images-upload';

import { toast } from 'react-toastify';


import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

// SERVICES
import userService from '../services/userService';


class Viewcontactheader extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 

		let contactid = this.state.requestedPageExtra;
		
		(async () => {

			let res = await userService.getcontact(contactid);

			if (res.status === true)
			{
			
				this.setState({contact: res.contact});

			}
			else
			{
			
				toast.error(res.message);
				store.dispatch( updateStore({ key: 'requestedPage', value: 'contacts' }) );
				store.dispatch( updateStore({ key: 'requestedPageExtra', value: null }) );
				
			}
		
		})();
		
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
    
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		var contactid = '';
		var contactfamilyname = '';
		var contactgivenname = '';
		var contactcountry = '';
		var contactemail = '';
		var contactphone = '';
		
		if (this.state.contact)
		{
		
			if (this.state.user._id === this.state.contact.userid_a._id)
			{

				contactid = this.state.contact.userid_b._id;
				contactfamilyname = this.state.contact.userid_b.familyname;
				contactgivenname = this.state.contact.userid_b.givenname;
				contactcountry = this.state.contact.userid_b.residence_country;
				contactemail = this.state.contact.userid_b.email;
				contactphone = this.state.contact.userid_b.phone_number;
		
			}
			else
			{

				contactid = this.state.contact.userid_a._id;
				contactfamilyname = this.state.contact.userid_a.familyname;
				contactgivenname = this.state.contact.userid_a.givenname;
				contactcountry = this.state.contact.userid_a.residence_country;
				contactemail = this.state.contact.userid_a.email;
				contactphone = this.state.contact.userid_a.phone_number;
				
			}
		
		}
			
		if (isLoggedIn === true)
		{
		
			let backgroundImage = 'url(api/backgroundimage/' + contactid + ')';

			let profileImage = 'url(api/profileimage/' + contactid + ')';

			return (
				<>
				<div className="container-fluid px-0">
					<div className="card overflow-hidden" style={{background: 'transparent', maxWidth: '1140px', margin: 'auto'}}>
						<div className="card-body p-0 h-150">
							<div className="background text-center" style={{backgroundImage: backgroundImage}} >

							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid top-70 text-center mb-4">
					<div className="avatar avatar-140 rounded-circle mx-auto shadow">
						<div className="background" style={{backgroundImage: profileImage}} >

						</div>
					</div>
				</div>

				<div className="container mb-4 text-center text-white">
					<h6 className="mb-1">{contactgivenname} {contactfamilyname}</h6>
					<p>{contactcountry}</p>
					<p className="mb-1">{contactemail}</p>
					<p>{contactphone}</p>
				</div>
				</>
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

export default Viewcontactheader;
