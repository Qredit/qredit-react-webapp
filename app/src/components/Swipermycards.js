import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// SERVICES
import userService from '../services/userService';

// install Swiper components
//SwiperCore.use([Pagination]);

class Homeswipemenu extends React.Component {

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


		if (isLoggedIn === true && this.state.user && this.state.user.bip39_user_recorded === true && this.state.user.pricingplan)
		{

			return (

<div className="container mb-4 px-0">
  {/* using this page temporarily for the cards thingy */}
  <div className="swiper-container offerslide2tab1 text-center swiper-container-horizontal">

	<div className="swiper-container swiper-cards swiper-container-horizontal">
    <div className="swiper-wrapper">
      <div className="swiper-slide swiper-slide-active" style={{marginRight: 30}}>
        <div className="card border-0 mb-3 metalcard textalwayswhite">
          <div className="card-header">
            <h6 className="mb-0">Visa <small>Extreme Metal</small></h6>
          </div>
          <div className="card-body">
            <h5 className="mb-0 mt-2">4444 5264 2541 26651</h5>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col">
                <p className="mb-0">26/21</p>
                <p className="small ">Expiry date</p>
              </div>
              <div className="col-auto align-self-center text-right">
                <p className="mb-0">John Doe</p>
                <p className="small">Card Holder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="swiper-slide swiper-slide-next" style={{marginRight: 30}}>
        <div className="card border-0 mb-3 goldcard textalwaysblack">
          <div className="card-header">
            <h6 className="mb-0">Visa <small>Qredit Founders Edition</small></h6>
          </div>
          <div className="card-body">
            <h5 className="mb-0 mt-2">4444 5264 2541 658952</h5>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col">
                <p className="mb-0">26/21</p>
                <p className="small ">Expiry date</p>
              </div>
              <div className="col-auto align-self-center text-right">
                <p className="mb-0">John Doe</p>
                <p className="small">Card Holder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="swiper-slide" style={{marginRight: 30}}>
        <div className="card border-0 mb-3 virtualcard textalwayswhite">
          <div className="card-header">
            <h6 className="mb-0">Visa <small>Virtual Card</small></h6>
          </div>
          <div className="card-body">
            <h5 className="mb-0 mt-2">4444 5264 2541 26651</h5>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col">
                <p className="mb-0">26/21</p>
                <p className="small ">Expiry date</p>
              </div>
              <div className="col-auto align-self-center text-right">
                <p className="mb-0">John Doe</p>
                <p className="small">Card Holder</p>
              </div>
            </div>
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

export default Swipermycards;
