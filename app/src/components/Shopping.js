import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Shopping extends React.Component {

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

	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{

			return (
<div className="container mb-4">
  <div className="card bgred" onClick={()=> window.open("https://hetzner.cloud/?ref=Esh1dU9r6wm0", "_blank")}>
    <div className="card-body">
      <div className="media">
        <div className="icon icon-50 bg-white text-default mr-2 rounded-circle">
          <div className="background" style={{backgroundImage: 'url("img/shopping/hetzner.svg")'}}>
            <img src="img/shopping/hetzner.svg" alt style={{display: 'none'}} />
          </div>
        </div>
        <div className="media-inner textalwayswhite">
          <h5 className="font-weight-normal"><b>€20</b> CLOUD CREDITS</h5>
		<p className="text-mute">Cloud Servers</p>
          <p className="text-mute">for new Hetzner users</p>
        </div>
        <div className="align-self-center ml-auto">
          <i className="material-icons">arrow_forward</i>
        </div>
      </div>
    </div>
  </div>
  <br/>
   <div className="card bgwish" onClick={()=> window.open("https://www.wish.com", "_blank")}>
    <div className="card-body">
      <div className="media">
        <div className="icon icon-50 bg-white text-default mr-2 rounded-circle">
          <div className="background" style={{backgroundImage: 'url("img/shopping/wish.png")'}}>
            <img src="img/shopping/wish.png" alt style={{display: 'none'}} />
          </div>
        </div>
        <div className="media-inner textalwayswhite">
          <h5 className="font-weight-normal"><b>€4</b> GIFT</h5>
		<p className="text-mute">for new users</p>
         <p className="text-mute">CODE: jzdlmbc</p>
        </div>
        <div className="align-self-center ml-auto">
          <i className="material-icons">arrow_forward</i>
        </div>
      </div>
    </div>
  </div>
    <br/>
   <div className="card bgflavorcards" onClick={()=> window.open("https://www.flavorcards.nl", "_blank")}>
    <div className="card-body">
      <div className="media">
        <div className="icon icon-50 bg-white text-default mr-2 rounded-circle">
          <div className="background" style={{backgroundImage: 'url("img/shopping/flavorcards.png")'}}>
            <img src="img/shopping/flavorcards.png" alt style={{display: 'none'}} />
          </div>
        </div>
        <div className="media-inner textalwayswhite">
          <h5 className="font-weight-normal"><b>10%</b> ORDER DISCOUNT</h5>
		    <p className="text-mute">flavorcards and crushballs</p>
         <p className="text-mute">CODE: qredit</p>
        </div>
        <div className="align-self-center ml-auto">
          <i className="material-icons">arrow_forward</i>
        </div>
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

export default Shopping;
