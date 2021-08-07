import React from 'react';
//import parse from "html-react-parser";

import { toast } from 'react-toastify';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

// 3rd Party Payments
import RevolutCheckout from "@revolut/checkout";

// SERVICES
import userService from '../services/userService';

import { Popover, OverlayTrigger, Dropdown } from 'react-bootstrap';

// import Swiper core and required components
import SwiperCore, { Pagination, Navigation, EffectCoverflow, Virtual } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([EffectCoverflow, Navigation, Virtual]);

class Pricingplan extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

		this.state.yearlyplans = true;
		this.state.monthlyplans = false;

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
			
			let nowstate = store.getState();
						
			if (nowstate.bottombutton1click === true)
			{
				this.doBuyRevolut();
				store.dispatch( updateStore({ key: 'bottombutton1click', value: false }) );
				store.dispatch( updateStore({ key: 'bottomupactive', value: false }) );
			}
			
			if (nowstate.bottombutton2click === true)
			{
				this.doBuyCoinPayments();
				store.dispatch( updateStore({ key: 'bottombutton2click', value: false }) );
				store.dispatch( updateStore({ key: 'bottomupactive', value: false }) );
			}

			if (nowstate.bottombutton3click === true)
			{
				this.doSelectDowngradePlan();
				store.dispatch( updateStore({ key: 'bottombutton3click', value: false }) );
				store.dispatch( updateStore({ key: 'bottomupactive', value: false }) );
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

	setYearly = (e) => {
		e.preventDefault();
		store.dispatch( updateStore({ key: 'yearlyplans', value: true }) );
		store.dispatch( updateStore({ key: 'monthlyplans', value: false }) );
	};
	
	setMonthly = (e) => {
		e.preventDefault();
		store.dispatch( updateStore({ key: 'yearlyplans', value: false }) );
		store.dispatch( updateStore({ key: 'monthlyplans', value: true }) );
	};
	
	doSelectDowngradePlan = () => {
	
		(async () => {
		
			var plan = this.state.selectedPlan;

			var type = 'monthly';
			if (this.state.yearlyplans === true)
			{
				type = 'yearly';
			}
			
			let data = {
				plan: plan,
				period: type,
				amount: 0.00
			};

			let res = await userService.selectdowngradeplan(data);

			if (res.status === true)
			{
				store.dispatch( updateStore({ key: 'user', value: res.user }) );
				toast.success(res.message);
			}
			else
			{
				toast.error(res.message);
			}
		
		})();
		
	};
		
	doBuyCoinPayments = () => {
	
		(async () => {
		
			var type = 'monthly';
			if (this.state.yearlyplans === true)
			{
				type = 'yearly';
			}
			
			var plan = this.state.selectedPlan;
			
			var amount = this.state.amountDue;		

			var ticker = document.getElementById("selectcurrency").value;


			let data = {
				plan: plan,
				period: type,
				amount: amount,
				ticker: ticker
			};

			let res = await userService.createcoinpaymentsorder(data);

			if (res.status === true)
			{
			
				console.log(res.checkouturl);
				
				window.open(res.checkouturl,'_blank');

			}
			else
			{

				toast.error(res.message);
			
			}
		
		})();
		
	};



	doBuyRevolut = () => {

		(async () => {

			var type = 'monthly';
			if (this.state.yearlyplans === true)
			{
				type = 'yearly';
			}
			
			var plan = this.state.selectedPlan;
			
			var amount = this.state.amountDue;			

			let data = {
				plan: plan,
				period: type,
				amount: amount
			};

			let res = await userService.createrevolutorder(data);

			if (res.status === true)
			{

				let orderid = res.orderid;
				let name = this.state.user.givenname + ' ' + this.state.user.familyname;
				let email = this.state.user.email;
			
				RevolutCheckout(orderid).then(function (instance) {
				  instance.payWithPopup({
				    name: name,
					email: email,
					savePaymentMethodFor: 'merchant',
					onSuccess() {
					
						(async () => {
						
							let data = {
								plan: plan,
								period: type,
								amount: amount,
								provider: 'revolut',
								orderid: orderid
							};

							let res = await userService.revolutpaymentapproved(data);

							if (res.status === true)
							{
								store.dispatch( updateStore({ key: 'user', value: res.user }) );
							}

							toast.success('Payment successfully processed');

						})();

					},
					onError(message) {

						toast.error('Error: ' + message);

					}
				  });
				});
			
			}

		})();

	};

	doBuy = (e, plan) => {
		e.preventDefault();

		/*
		var type = 'monthly';
		if (this.state.yearlyplans === true)
		{
			type = 'yearly';
		}
		*/
		
		(async () => {
		
			this.setState({dobuyloading: true});
		
			var type = 'yearly';
		
			store.dispatch( updateStore({ key: 'selectedPlan', value: plan }) );
			
			
			let res = await userService.upgradeplan(plan);
			
			if (res.status === false)
			{
			
				toast.error(res.message);
			
			}
			else
			{
			
				var amount = 0;
				
				if (res.type === 'upgrade')
				{
					amount = res.prorataprice;
				}
		
				store.dispatch( updateStore({ key: 'amountDue', value: amount }) );


				let ucplan = plan[0].toUpperCase() + plan.slice(1);
				let uctype = type[0].toUpperCase() + type.slice(1);
		

		
				if (amount > 0)
				{
				
					// It's an upgrade

					var paymentinfo = "Amount Due: €" + amount;
					if (res.isprorated === true) paymentinfo += " (Prorated credit applied)";
					
					paymentinfo += "<br />Plan Price: €" + res.newplanprice + " /" + (type==='monthly'?'mo':'year');

					paymentinfo += "<br />Your new plan will take effect immediately<hr>";
				
					paymentinfo += "Payment Options:<br /><br />";
		
					//store.dispatch( updateStore({ key: 'bottombutton1text', value: "Pay with Credit Card" }) );
			
					//paymentinfo += "<button id='bottombutton1'></button><br /><br />";

					if (type === 'yearly')
					{
			
						store.dispatch( updateStore({ key: 'bottombutton2text', value: "Pay with Cryptocurrency" }) );


						paymentinfo += `<div class="btn-group">
									<button id="bottombutton2" type="button" class="btn"></button>
									<div class="btn-group dropup">
										<select class='select' id="selectcurrency">
											<option value="BTC">BTC</a>
											<option value="ETH">ETH</a>
											<option value="LTC">LTC</a>
											<option value="DASH">DASH</a>
											<option value="USDT">USDT</a>
										</select>
									</div>
								</div>`;
			
					}
		
				}
				else
				{

					var paymentinfo = "Amount Due: €" + amount;
					paymentinfo += "<br />Plan Price: €" + res.newplanprice + " /" + (type==='monthly'?'mo':'year');

					paymentinfo += "<br />Your new plan will take effect on " + res.nextbilldate.substr(0,10) + "<hr>";
				
					store.dispatch( updateStore({ key: 'bottombutton3text', value: "Select Plan" }) );
			
					paymentinfo += "<button id='bottombutton3'></button><br /><br />";
		
				}

				this.setState({dobuyloading: false});

				store.dispatch( updateStore({ key: 'bottomUpHeader', value: ucplan + ' ' + uctype + " Plan" }) );
				store.dispatch( updateStore({ key: 'bottomUpInfo', value: paymentinfo }) );
				store.dispatch( updateStore({ key: 'bottomupactive', value: true }) );

			}

		})();
		
	};

	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		if (isLoggedIn === true)
		{
		
		
			var initialslide = 0;
			
			if (this.state.user && (this.state.user.pricingplan === 'pro' || this.state.user.pricingplan === 'corppro'))
			{
				initialslide = 1;
			}
			else if (this.state.user && (this.state.user.pricingplan === 'extreme' || this.state.user.pricingplan === 'corpextreme'))
			{
				initialslide = 2;
			}
			else if (this.state.user && (this.state.user.pricingplan === 'epic' || this.state.user.pricingplan === 'corpepic'))
			{
				initialslide = 3;
			}
		
		
			if (this.state.user && (!this.state.user.pricingplan || this.state.requestedPage === 'pricingplan'))
			{


/*
						<div className="row justify-content-center mt-4">
							<div id="monthly-yearly-chenge" className="custom-change">
								<a onClick={ e => this.setMonthly(e) } href="/" className={"monthly-price f-size12 " + (this.state.monthlyplans?'active':'')}> <span className="change-box-text">monthly</span> <span className="change-box"></span></a>
								<a onClick={ e => this.setYearly(e) } href="/" className={"yearli-price f-size12 " + (this.state.yearlyplans?'active':'')}> <span className="change-box-text">annually</span></a>
							</div>
						</div>
*/


				var plans = this.state.plans || [];
				
				return (
					
					<div className="card text-left mt-2">
					

						<div className="row justify-content-center mt-2 mb-4">
							<center>Below is special promotional pricing for pre-registering.   Your plan start date will be on the date we begin the banking and card services, which is anticipated to be May/June 2021.  </center>
						</div>

						<div className="row justify-content-center mt-2 mb-4">
							<center><h5>Your Current Plan: <strong style={{textTransform: 'uppercase'}}>{this.state.user.pricingplan || 'N/A'}</strong></h5>
							
							
							{this.state.user.pricingplan!==null?(
							<>
							Billing renewal date: <strong>{this.state.user.nextbillingdate?this.state.user.nextbillingdate.substr(0,10):'N/A'}</strong>
							<br/>
							Plan next billing cycle: <strong style={{textTransform: 'uppercase'}}>{this.state.user.nextbillingplan || this.state.user.pricingplan || 'N/A'}</strong>
							</>
							):"Please Select a Plan"}
							</center>
						</div>
						
						<div className="container pr-0 pl-0">
						
						<Swiper
						  spaceBetween={0}
						  slidesPerView={1}
						  pagination={{ clickable: true }}
						  navigation
						  className="introduction text-white pb-5"
						  effect="coverflow"
						  preventClicks={false}
						  preventClicksPropagation={false}
						  onClick={ (s, e) => { e.preventDefault() }}
						  initialSlide={initialslide}
						  virtual
						>

						{plans.map((planitem, index) => (

							<SwiperSlide key={planitem.planid} virtualIndex={index} className="overflow-hidden text-center">
								<div className="first-pricing-table" style={{width:'90%', margin:'auto'}}>
									<i className="fas fa-rainbow first-pricing-table-icon"></i>
									<h5 className="first-pricing-table-title">{planitem.name}
									</h5>
									<span style={{textAlign: "center"}} className="plan-price second-pricing-table-price">
										{parseFloat(planitem.yearlyprice)===0?planitem.iscustomplan===true?(<i>Get Quote</i>):(<i>FREE</i>):(
										<i>€{parseFloat(planitem.yearlyprice).toFixed(2).replace('.',',')} <span style={{opacity: "0.5", fontSize: "14px"}}>/year</span></i>)}
									</span>
									<ul className="first-pricing-table-body">

										{index!==0?(
										<li>Everything from {plans[index-1]['name']} - <i>PLUS:</i></li>
										):''}
										
										{planitem.hascryptowallets===true && (index===0 || planitem.hascryptowallets !== plans[index-1]['hascryptowallets'])?(

											<>
											<OverlayTrigger key={0} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Crypto Payments</Popover.Title>
																				<Popover.Content>
																					Send and receive cryptocurrency transactions such as Qredit, Bitcoin, Litecoin, Ethereum, and more.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Crypto Payments</li>
											</OverlayTrigger>

											<OverlayTrigger key={1} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Tokenized Euro Wallet</Popover.Title>
																				<Popover.Content>
																					Instantly send digital tokens pegged against the Euro currency.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Tokenized Euro Wallet</li>
											</OverlayTrigger>
											</>
											
										):''}
										
										{planitem.hasqreditpassport===true && (index===0 || planitem.hasqreditpassport !== plans[index-1]['hasqreditpassport'])?(

											<OverlayTrigger key={2} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Qredit Passport</Popover.Title>
																				<Popover.Content>
																					Your digital passport allows you to verify instantly at checkouts, websites or any supported 3rd party.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Qredit Passport</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasdedicatediban===true && (index===0 || planitem.hasdedicatediban !== plans[index-1]['hasdedicatediban'])?(

											<OverlayTrigger key={3} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Dedicated IBAN Account</Popover.Title>
																				<Popover.Content>
																					Send and receive funds anywhere in Europe with your dedicated SEPA/IBAN account.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Dedicated IBAN Account</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasaccesstoloans && (index===0 || planitem.hasaccesstoloans !== plans[index-1]['hasaccesstoloans'])?(

											<OverlayTrigger key={4} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Access to loans up to €{planitem.hasaccesstoloans}</Popover.Title>
																				<Popover.Content>
																					Create credibility and access direct flash loans up to €{planitem.hasaccesstoloans}. Repay within {planitem.loanrepaymentperiod} days. {planitem.loaninterest}% APR
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Access to loans up to €{planitem.hasaccesstoloans}</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasqreditinsurance===true && (index===0 || planitem.hasqreditinsurance !== plans[index-1]['hasqreditinsurance'])?(

											<OverlayTrigger key={5} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Access to Qredit Insurance</Popover.Title>
																				<Popover.Content>
																					Insure your mobile phone or vehicle with Qredit Insurance
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Access to Qredit Insurance</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasprioritysupport===true && (index===0 || planitem.hasprioritysupport !== plans[index-1]['hasprioritysupport'])?(

											<OverlayTrigger key={6} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Priority Support</Popover.Title>
																				<Popover.Content>
																					Priority Support 24/7
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Priority Support</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasvirtualdebitcards && (index===0 || planitem.hasvirtualdebitcards !== plans[index-1]['hasvirtualdebitcards'])?(

											<OverlayTrigger key={7} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Virtual Debit Cards ({planitem.hasvirtualdebitcards})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.hasvirtualdebitcards} Virtual Debit Cards for online payments!
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Virtual Debit Cards ({planitem.hasvirtualdebitcards})</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hasphysicaldebitcards && (index===0 || planitem.hasphysicaldebitcards !== plans[index-1]['hasphysicaldebitcards'])?(

											<OverlayTrigger key={8} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Physical Debit Cards ({planitem.hasphysicaldebitcards})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.hasphysicaldebitcards} Physical Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Physical Debit Cards ({planitem.hasphysicaldebitcards})</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hascorporatevirtualvisa && (index===0 || planitem.hascorporatevirtualvisa !== plans[index-1]['hascorporatevirtualvisa'])?(

											<OverlayTrigger key={15} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Virtual Debit Cards ({planitem.hascorporatevirtualvisa})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.hasvirtualdebitcards} Corporate Virtual Debit Cards for online payments!
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Virtual Debit Cards ({planitem.hascorporatevirtualvisa})</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hascorporateplasticvisa && (index===0 || planitem.hascorporateplasticvisa !== plans[index-1]['hascorporateplasticvisa'])?(

											<OverlayTrigger key={16} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Physical Debit Cards ({planitem.hascorporateplasticvisa})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.hasphysicaldebitcards} Physical (Plastic) Corporate Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Physical Debit Cards ({planitem.hascorporateplasticvisa})</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hascorporatemetalvisa && (index===0 || planitem.hascorporatemetalvisa !== plans[index-1]['hascorporatemetalvisa'])?(

											<OverlayTrigger key={17} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Metal Debit Cards ({planitem.hascorporatemetalvisa})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.hascorporatemetalvisa} Physical (Metal) Corporate Debit Cards. Pay in stores or withdraw from ATM's using your Physical Debit Card!
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Metal Debit Cards ({planitem.hascorporatemetalvisa})</li>
											</OverlayTrigger>
										
										):''}
										
										{planitem.founderscard && (index===0 || planitem.founderscard !== plans[index-1]['founderscard'])?(

											<OverlayTrigger key={9} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Exclusive Qredit Founders Card ({planitem.founderscard})</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.founderscard} Qredit Founders Physical Debit Cards. 
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Exclusive Qredit Founders Card ({planitem.founderscard})</li>
											</OverlayTrigger>
										
										):''}
										
										{planitem.modelxdrawing===true && (index===0 || planitem.modelxdrawing !== plans[index-1]['modelxdrawing'])?(

											<OverlayTrigger key={10} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Entry into Model X Drawing</Popover.Title>
																				<Popover.Content>
																					Receive a free entry into the Tesla Model X drawing. 
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Entry into Model X Drawing</li>
											</OverlayTrigger>
										
										):''}

										{planitem.earlybirdxqrbonus && (index===0 || planitem.earlybirdxqrbonus !== plans[index-1]['earlybirdxqrbonus'])?(

											<OverlayTrigger key={11} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Early Bird XQR Bonus: ({planitem.earlybirdxqrbonus} XQR)</Popover.Title>
																				<Popover.Content>
																					Receive an early bird bonus of ({planitem.earlybirdxqrbonus} XQR into your Qredit Motion account automatically.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Early Bird XQR Bonus: ({planitem.earlybirdxqrbonus} XQR)</li>
											</OverlayTrigger>
										
										):''}



										{planitem.hasmerchantplatform===true && (index===0 || planitem.hasmerchantplatform !== plans[index-1]['hasmerchantplatform'])?(

											<OverlayTrigger key={12} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Merchant Payments Platform</Popover.Title>
																				<Popover.Content>
																					Accept Payments in EUR or Cryptocurrencies
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Merchant Payments Platform</li>
											</OverlayTrigger>
										
										):''}

										{planitem.hascorporatepassport===true && (index===0 || planitem.hascorporatepassport !== plans[index-1]['hascorporatepassport'])?(

											<OverlayTrigger key={13} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Qredit Corporate Passport</Popover.Title>
																				<Popover.Content>
																					Your digital passport allows you to verify instantly at checkouts, websites or any supported 3rd party.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Qredit Corporate Passport</li>
											</OverlayTrigger>
										
										):''}

										{planitem.maxteammembers && (index===0 || planitem.maxteammembers !== plans[index-1]['maxteammembers'])?(

											<OverlayTrigger key={14} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Up to {planitem.maxteammembers} team members</Popover.Title>
																				<Popover.Content>
																					Up to {planitem.maxteammembers} team members
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Up to {planitem.maxteammembers} team members</li>
											</OverlayTrigger>
										
										):''}

										{planitem.iscustomplan?(

											<OverlayTrigger key={18} overlay={<Popover id="popover-basic1">
																				<Popover.Title as="h3" style={{color: "#000"}}>Customized Plan to Fit Your Needs</Popover.Title>
																				<Popover.Content>
																					Customized Plan to Fit Your Needs. A representative will contact you after you select this plan to help determine your needs.
																				</Popover.Content>
																			  </Popover>}>
											  <li className='lilink'>Customized Plan to Fit Your Needs</li>
											</OverlayTrigger>
										
										):''}
										
									</ul>
									{this.state.user.pricingplan !== planitem.plancode?(
									<li onClick={ e => this.doBuy(e, planitem.plancode) } className="lilink first-pricing-table-order">{this.state.dobuyloading===true?(<i className="fa fa-circle-o-notch fa-spin" />):'Select Plan'}</li>
									):(
									<li className="lilink first-pricing-table-order">Current Plan</li>
									)}
								</div>
							</SwiperSlide>
							
						))}




						</Swiper>
						</div>
						
						<div className="row justify-content-start mt-4 mr-2 ml-2">
							<div className="col-md-4">
								<div className="host-pack-features">
									<i className="fa fa-usd"></i>
									<h5>Staking Rewards</h5>
									<p>All plans include Qredit staking rewards. Lock in your assets and earn passive income!</p>
								</div>
							</div>

							<div className="col-md-4">
								<div className="host-pack-features">
									<i className="fa fa-check"></i>
									<h5>Refills</h5>
									<p>Buy gift cards or top-up without any additional account creation.</p>
								</div>
							</div>

							<div className="col-md-4">
								<div className="host-pack-features">
									<i className="fa fa-life-ring"></i>
									<h5>Multicurrency Wallet</h5>
									<p>Exchange your funds to any currency, instantly.</p>
								</div>
							</div>

						</div>
					<div className="hr-thin" />

						<div className="container mt-4 text-center mb-5">
							<h4>Benefits for Extreme and Epic Subscribers (EU)</h4>
							<p>Until Promotion Ends</p>
						</div>
						<div className="container">
  							<div className="row justify-content-start">
    							<div className="col-md-4 mb-4">
      								<div className="games-server-plan">
	  									<div><center><img style={{maxWidth: 150}} src="https://i.pinimg.com/originals/ef/f2/91/eff29127abbf0d8e5e99cda29401fa7f.png" /></center></div>
       									 <h5 style={{marginTop: 10}}>Chance to win a <br />Tesla Model X</h5>
        								<ul>
        								<li>Chance to win a Tesla Model X</li>
        								<li>Join our referral program for a higher chance</li>
        								<li>Winner will be announced in December 2021</li>
        								</ul>
     							 </div>
   							 </div>
  						  <div className="col-md-4 mb-4">
     						  <div className="games-server-plan">
								  <div><center><img style={{maxWidth: 150, marginTip:'-20%'}} src="/img/qreditcard-min.png" /></center></div>
      								  <h5 style={{marginTop: 10}}>Founders Edition <br />Visa Metal Card</h5>
        								<ul>
        								<li>Premium Metal Card</li>
        								<li>Limited Edition</li>
        								<li>Available until pre-subscription ends</li>
        								</ul>
     							 </div>
    						</div>
   						 <div className="col-md-4 mb-4">
     						 <div className="games-server-plan">
	  							  <div><center><img style={{maxWidth: 100}} src="https://qredit.io/img/qredit-square.png" /></center></div>
       								 <h5 style={{marginTop: 10}}>Bonus <br />Qredit Coins</h5>
        								<ul>
        								<li>Subscribe to our Extreme or Epic Plan</li>
        								<li>Receive a bonus of XQR</li>
        								<li>XQR will be sent within 24 hours</li>
        							</ul>
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
		else
		{

			return (
				<div />
			);

		}
	}
	
}

export default Pricingplan;
