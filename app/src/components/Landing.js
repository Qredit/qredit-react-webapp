import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';

// import Swiper core and required components
import SwiperCore, { Pagination, EffectCoverflow } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([EffectCoverflow]);


class Landing extends React.Component {

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
				
		return (
			<div className="container h-100">
				<Swiper
				  spaceBetween={0}
				  slidesPerView={1}
				  pagination={{ clickable: true }}
				  className="introduction text-white"
				  effect="coverflow"
				>
				  <SwiperSlide className="overflow-hidden text-center">
					<div className="row no-gutters h-100">
						<div className="col align-self-center px-3">
							<img src="/img/1.png" alt="" className="mw-99 my-5" style={{maxWidth: 250}} />
							<div className="row">
								<div className="container mb-5">
									<h4>Qredit Motion</h4>
									<h6>Digital Banking Excellence</h6>
									<p>The new and revolutionary Qredit Motion App empowers users to spend a broad range of crypto and fiat currencies with real-time conversion at point-of-sale and low exchange fees.
									</p>
								</div>
							</div>
						</div>

					</div>
				  </SwiperSlide>
				  <SwiperSlide className="overflow-hidden text-center">
					<div className="row no-gutters h-100">
						<div className="col align-self-center px-3">
							<img src="/img/2.png" alt="" className="mw-99 my-5"  style={{maxWidth: 250}} />
							<div className="row">
								<div className="container mb-5">
									<h6>Open Banking Standard Compliant</h6>
									<p>It opens the way to new products and services that could help customers and small to medium-sized businesses get a better deal.</p>
									<p>It could also give you a more detailed understanding of your accounts, and help you find new ways to make the most of your money.</p>
								
								</div>
							</div>
						</div>
					</div>
				  </SwiperSlide>
				  <SwiperSlide className="overflow-hidden text-center">
					<div className="row no-gutters h-100">
						<div className="col align-self-center px-3">
							<img src="/img/3.png" alt="" className="mw-99 my-5"  style={{maxWidth: 250}} />
							<div className="row">
								<div className="container mb-5">
									<h6>Multi Cryptocurrency and Fiat Digital Wallet</h6>
									<p>A secure digital wallet, buy, store, exchange and earn crypto.</p>
									<p>Hardware wallets to be supported in future releases.</p>
								</div>
							</div>
						</div>
					</div>
				  </SwiperSlide>
				</Swiper>
			</div>
		);

	}
	
}

export default Landing;
