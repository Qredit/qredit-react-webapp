import React, { Fragment } from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";
import QRCode from "react-qr-code";
import copy from "copy-to-clipboard";

// SERVICES
import userService from '../services/userService';



// import Swiper core and required components
import SwiperCore, { Pagination, Navigation, EffectCoverflow, Virtual } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';


import ReactTooltip from 'react-tooltip';

import Select, { components } from 'react-select';

SwiperCore.use([EffectCoverflow, Navigation, Virtual]);

class Wallet extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		if (!this.state.sendForm)
			this.state.sendForm = {};
			
		if (!this.state.sendFormFeedback)
			this.state.sendFormFeedback = {};
				
	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
			
			let teststate = store.getState();
			if (teststate.modalButtonClick === true)
			{

				if (this.state.modalType === 'send')
				{
					this.doModalSend();
				}

				if (this.state.modalType === 'request')
				{
					this.doModalRequest();
				}

				if (this.state.modalType === 'vote')
				{
					this.doModalVote();
				}

				if (this.state.modalType === 'createwallet')
				{
					this.doModalCreateWallet();
				}
				
			}

			if (teststate.wss && teststate.wss === 'newtx')
			{
			
				if (this.state.walletid && this.state.walletid !== null)
				{

					store.dispatch( updateStore({ key: 'wss', value: null }) );

					this.refresh();
				
				}
			
			}
			
		}); 
		
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	doModalSend = () => {

		//console.log('model button click');
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		var contactid = this.state.sendForm.send_contactid || null;
		var address = this.state.sendForm.send_address || null;
		var amount = this.state.sendForm.send_amount || null;
		var pass = this.state.sendForm.send_password || null;
	
		var error = false;
		
		if (isNaN(parseFloat(amount)))
		{
			error = true;
		}
		
		if (!isFinite(amount))
		{
			error = true;
		}
		
		if (contactid === null && (address === null || address == ''))
		{
			error = true;
		}
		
		if (error === true)
		{
		
			toast.error('Form error');
		
		}
		else
		{

			(async () => {

				let res = await userService.sendtransaction(this.state.walletid, contactid, address, amount, pass);

				if (res.status === true)
				{
				
					toast.success(res.message);
	
				}
				else
				{
			
					toast.error(res.message);

				}

			})();
		
		}

	};
	
	doModalVote = () => {

		//console.log('model button click');
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		var tovote = this.state.sendForm.send_vote;
		var pass = this.state.sendForm.send_password;
	
		var error = false;
		
		(async () => {

			let res = await userService.sendqreditvote(this.state.walletid, tovote, pass);

			if (res.status === true)
			{
			
				toast.success(res.message);

			}
			else
			{
		
				toast.error(res.message);

			}

		})();
		
	};
	
	doModalRequest = () => {

		//console.log('model button click');
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

toast.success('request');

/*
		(async () => {

			let res = await userService.bip39recorded();

			if (res.status === true)
			{
				store.dispatch( updateStore({ key: 'user', value: res.user }) );
			}

		})();
*/

	};
	
	goToWallet = (e) => {
		
		e.preventDefault();
		
		var walletid = e.target.id
		var color = e.target.dataset.color;
		var name = e.target.dataset.name;
		var ticker = e.target.dataset.ticker;
		var balance = e.target.dataset.balance;
		
		this.setState({loadingwallet: true, walletid: walletid, walletcolor: color, walletname: name, walletticker: ticker, walletbalance: balance, walletaddresses: []});
		
		// Load Wallet details
		
		(async () => {

			let res = await userService.getwalletaddresses(walletid);

			if (res.status === true)
			{
				this.setState({walletaddresses: res.addresslist});
			}
			
			this.refresh();

			this.setState({loadingwallet: false});

		})();
		
	};

	goBack = (e) => {
		
		e.preventDefault();

		this.setState({loadingwallet: false, walletid: null, walletcolor: null, walletname: null, walletticker: null, walletbalance: null, walletaddresses: []});
		
	};
	
	refresh = () => {
	
		(async () => {
		
			this.setState({ shownItems: 10, initialLoad: true });
		
			let res = await userService.getwallettransactions(this.state.walletid, 0, 10);

			if (res.status === true)
			{
				this.setState({'transactionlist': res.transactionlist});
				this.setState({'hasMore': res.hasmore});
				this.setState({'initialLoad': false});

			}

			let resbal = await userService.getwalletbalance(this.state.walletid);

			if (resbal.status === true)
			{
				this.setState({'walletbalance': resbal.balance});
			}
			
			let resuser = await userService.get();
			
			if (resuser.status === true)
			{

				store.dispatch( updateStore({ key: 'user', value: resuser.user }) );

			}
			
			
		})();
	};
	
	fetchMoreData = () => {
	
		(async () => {
		
			var currentCount = this.state.shownItems || 10;
			var newCount = currentCount + 10;
			var skip = newCount - 10;
			var limit = 10;
		
			this.setState({ shownItems: newCount });
		
			let res = await userService.getwallettransactions(this.state.walletid, skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.transactionlist.concat(res.transactionlist);
			
				this.setState({'transactionlist': newhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
	};

	viewTransaction = (e, id) => {
	
		e.preventDefault();
		
		(async () => {
				
			let res = await userService.gettransaction(this.state.walletid, id);

			if (res.status === true)
			{

				console.log(res);
				
				var transactionitem = res.transaction;
				
				var vList = '';

				if (transactionitem.details.asset && transactionitem.details.asset.votes)
				{

					vList = transactionitem.details.asset.votes.length > 0
						&& transactionitem.details.asset.votes.map((item, i) => {
						return (
							<p className="small text-secondary mb-0">{item}</p>
						)
					}, this);

				}

				this.setState({ modalType: 'viewtx' });
				
				let modalData = (
					<div className="row">
						<div className="col">
							<p className="small text-secondary mb-0"><strong>TXID:</strong>&nbsp;{transactionitem.txid}</p>
							<p className="small text-secondary mb-0"><strong>Direction:</strong>&nbsp;{transactionitem.direction}</p>
							<p className="small text-secondary mb-0"><strong>Amount:</strong>&nbsp;{transactionitem.details.amount/100000000}</p>
							<p className="small text-secondary mb-0"><strong>Fee:</strong>&nbsp;{parseInt(transactionitem.details.fee)/100000000}</p>
							<p className="small text-secondary mb-0"><strong>Timestamp:</strong>&nbsp;{transactionitem.details.timestamp.human.substr(0,19).replace('T',' at ')}</p>
							<p className="small text-secondary mb-0"><strong>Sender:</strong>&nbsp;{transactionitem.details.sender}</p>
							<p className="small text-secondary mb-0"><strong>Recipient:</strong>&nbsp;{transactionitem.details.recipient}</p>
							<p className="small text-secondary mb-0"><strong>Type:</strong>&nbsp;{this.getType(transactionitem.details.type)}</p>
							<p className="small text-secondary mb-0"><strong>BlockHeight:</strong>&nbsp;{transactionitem.details.blockHeight}</p>
							<p className="small text-secondary mb-0"><strong>BlockID:</strong>&nbsp;{transactionitem.details.blockId}</p>
							{(transactionitem.details.asset && transactionitem.details.asset.votes)?(
								<><p className="small text-secondary mb-0"><strong>Votes:</strong></p>{vList}</>
							):''}

						</div>
					</div>
				);

				store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
				store.dispatch( updateStore({ key: 'modalData', value: null }) );
				store.dispatch( updateStore({ key: 'modalButton', value: null }) );
				store.dispatch( updateStore({ key: 'modalTitle', value: 'View Transaction' }) );
				store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
				
			}
		
		})();
	};
  
	doDeposit = (e) => {

		e.preventDefault();
				
		var topaddress = this.state.walletaddresses[0].address;

		copy(topaddress);
		toast.success('Address Copied to Clipboard');
		
		let modalData = (
			<div style={{textAlign:'center'}} >
		  		<QRCode value={topaddress} /><div style={{marginTop:'10px'}}>{topaddress}</div>
		  	</div>
		);

		store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
		store.dispatch( updateStore({ key: 'modalData', value: null }) );
		store.dispatch( updateStore({ key: 'modalButton', value: null }) );
		store.dispatch( updateStore({ key: 'modalTitle', value: 'Deposit ' + this.state.walletticker }) );
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

	};
	
	doCopyAddress = (e, address) => {

		e.preventDefault();
		
		copy(address);
		
		toast.success('Address Copied to Clipboard');
		
	};

	doCopyTxid = (e, txid) => {

		e.preventDefault();
		
		copy(txid);
		
		toast.success('Transaction ID Copied to Clipboard');
		
	};

	handleSendFormChange = event => {

		if (event.target.type === 'checkbox')
		{
			event.target.value = event.target.checked;
		}

		var currentSendForm = this.state.sendForm;
		
		currentSendForm[event.target.id] = event.target.value;

		this.setState({sendForm:currentSendForm});


		var currentSendFormFeedback = this.state.sendFormFeedback;
		
		let feedbackname = event.target.id.replace('send_', '') + 'invalid';
		
		currentSendFormFeedback[feedbackname] = null;
		
		this.setState({sendFormFeedback:currentSendFormFeedback});

	};

	handleContactSendFormChange = selectedOption => {

		if (selectedOption !== null)
		{
		
			var currentSendForm = this.state.sendForm;
		
			currentSendForm['send_contactid'] = selectedOption.value;

			this.setState({sendForm:currentSendForm});
		
			document.querySelector('#sendaddressfield').style.display = 'none';

		}
		else
		{

			var currentSendForm = this.state.sendForm;
		
			currentSendForm['send_contactid'] = null;

			this.setState({sendForm:currentSendForm});
			
			document.querySelector('#sendaddressfield').style.display = 'block';
		
		}

	};
  
	doSend = (e) => {

		e.preventDefault();
		
		(async () => {

			const userid = this.state.user._id || '';

			var colourOptions = [];

			let contacts = await userService.getcontacts(0, 100);

			if (contacts.status === true)
			{

				for (let i = 0; i < contacts.contactlist.length; i++)
				{
				
					let thiscontact = contacts.contactlist[i];
					
					let cvalue = userid===thiscontact.userid_b._id?thiscontact.userid_a._id:thiscontact.userid_b._id;
					let ccolor = "/api/profileimage/" + (userid===thiscontact.userid_b._id?thiscontact.userid_a._id:thiscontact.userid_b._id);
					let clabel = (userid===thiscontact.userid_b._id?thiscontact.userid_a.givenname:thiscontact.userid_b.givenname) + ' ' + (userid===thiscontact.userid_b._id?thiscontact.userid_a.familyname:thiscontact.userid_b.familyname) + ' (' + (userid===thiscontact.userid_b._id?thiscontact.userid_a.email:thiscontact.userid_b.email) + ')';
					
					let cdetails = {value: cvalue, color: ccolor, label: clabel};
					
					colourOptions.push(cdetails);
				
				}
				
			}
			

			const dot = (color) => ({
			  alignItems: 'center',
			  display: 'flex',
			  ':before': {
				background: 'url(' + color + ')',
				backgroundSize: 'contain',
				borderRadius: 5,
				content: '" "',
				display: 'block',
				marginRight: 8,
				height: 30,
				width: 30,
				minWidth: 30
			  },
			});

			const colourStyles = {
			  control: styles => ({ ...styles }),
			  
			  option: (styles, { data, isDisabled, isFocused, isSelected }) => {

				return {
				  ...styles,
				  ...dot(data.color),
				  backgroundColor: isDisabled
					? null
					: isSelected
					? '#BBF'
					: isFocused
					? '#DDF'
					: null,
				  cursor: isDisabled ? 'not-allowed' : 'default',

				  ':active': {
					...styles[':active'],
					backgroundColor:
					  !isDisabled && (isSelected ? '#FFF' : '#DDF'),
				  },
				};
			  },
			  
			  input: styles => ({ ...styles }),
			  placeholder: styles => ({ ...styles }),
			  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
			};

			this.setState({ modalType: 'send' });


			let modalData = (
				<form className="was-validated">
				
					<div className="form-group float-label position-relative active" style={{zIndex:'99999'}}>

						  <Select
							options={colourOptions}
							styles={colourStyles}
							isClearable={true}
							isSearchable={true}
							id="send_contact"
							onChange={this.handleContactSendFormChange}
						  />

						<label className="form-control-label text-white">Contact</label>
					</div>
				
					
					<div className="form-group float-label position-relative active" id='sendaddressfield'>
						<input required id="send_address" type="text" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Address</label>
					</div>

					<div className="form-group float-label position-relative active">
						<input required id="send_amount" type="text" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Amount</label>
					</div>
					<div className="form-group float-label position-relative active">
						<input required id="send_password" type="password" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Password</label>
					</div>

				</form>
			);

			store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
			store.dispatch( updateStore({ key: 'modalData', value: null }) );
			store.dispatch( updateStore({ key: 'modalButton', value: 'Send' }) );
			store.dispatch( updateStore({ key: 'modalTitle', value: 'Send ' + this.state.walletticker }) );
			store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
		
		})();
	};

	doVote = (e) => {

		e.preventDefault();
		
		(async () => {
		
			let res = await userService.getdelegatelist(this.state.walletid);

			let cvote = await userService.getwalletvotes(this.state.walletid);

			let dList = res.delegates.length > 0
				&& res.delegates.map((item, i) => {
				return (
					<option key={i} value={item.publicKey} selected={cvote.vote===item.publicKey?'selected':false}>{item.username}</option>
				)
			}, this);

			this.setState({ modalType: 'vote' });

						
			if (cvote.vote)
			{
				var currentSendForm = this.state.sendForm;
				currentSendForm["send_vote"] = cvote.vote;
				this.setState({sendForm:currentSendForm});
				
				let cvotename = '';
				
				for (let i = 0; i < res.delegates.length; i++)
				{
					let ditem = res.delegates[i];
					if (ditem.publicKey === cvote.vote)
					{
					
						cvotename = ditem.username;
					
					}
				}

				let modalData = (
					<form className="was-validated">
				
						<p>You must first Un-vote your current vote prior to making a new vote.</p>
				
						<div className="form-group float-label position-relative active">
							<input readonly className="form-control text-white" value={cvotename} />
							<label className="form-control-label text-white">Voting For</label>
						</div>
						<div className="form-group float-label position-relative active">
							<input required id="send_password" type="password" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
							<label className="form-control-label text-white">Password</label>
						</div>

					</form>
				);

				store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
				store.dispatch( updateStore({ key: 'modalData', value: null }) );
				store.dispatch( updateStore({ key: 'modalButton', value: 'Unvote' }) );
				store.dispatch( updateStore({ key: 'modalTitle', value: 'Unvote ' + this.state.walletticker + ' Delegate' }) );
				store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
		
		
			}
			else
			{
				
				let modalData = (
					<form className="was-validated">
				
						<p>Select the delegate that you wish to vote for.</p>
				
						<div className="form-group float-label position-relative active">

							<select required id="send_vote" className="form-control text-white" onChange={this.handleSendFormChange}>
								<option/>
							  {dList}
							</select>

							<label className="form-control-label text-white">Vote For</label>
						</div>
						<div className="form-group float-label position-relative active">
							<input required id="send_password" type="password" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
							<label className="form-control-label text-white">Password</label>
						</div>

					</form>
				);

				store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
				store.dispatch( updateStore({ key: 'modalData', value: null }) );
				store.dispatch( updateStore({ key: 'modalButton', value: 'Vote' }) );
				store.dispatch( updateStore({ key: 'modalTitle', value: 'Vote for ' + this.state.walletticker + ' Delegate' }) );
				store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
		
			}
		
		})();
	};
	
	doPayReceive = (e) => {

		e.preventDefault();
		
		(async () => {

			this.setState({ modalType: 'request' });

			let modalData = (
				<form className="was-validated">
				
					<div className="form-group float-label position-relative active">

						<select required id="request_contact" className="form-control text-white" onChange={this.handleSendFormChange}>
						  <option value=''></option>
						</select>

						<label className="form-control-label text-white">Contact</label>
					</div>
				
					<div className="form-group float-label position-relative active">
						<input required id="request_email" type="text" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Email</label>
					</div>
					<div className="form-group float-label position-relative active">
						<input required id="request_amount" type="text" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Amount</label>
					</div>
					<div className="form-group float-label position-relative active">
						<input required id="request_detail" type="text" className="form-control text-white" onChange={this.handleSendFormChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Notes/Details</label>
					</div>

				</form>
			);

			store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
			store.dispatch( updateStore({ key: 'modalData', value: null }) );
			store.dispatch( updateStore({ key: 'modalButton', value: 'Request' }) );
			store.dispatch( updateStore({ key: 'modalTitle', value: 'Request ' + this.state.walletticker }) );
			store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
		
		})();
	};
	
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

	handleCreateWalletChange = event => {


		var currentWalletForm = this.state.walletForm || {};
		
		currentWalletForm[event.target.id] = event.target.value;

		this.setState({walletForm: currentWalletForm});

	};
	
	createWallet = (e) => {

		e.preventDefault();
				
		(async () => {
		
			let res = await userService.getavailcryptocurr();

			this.setState({ modalType: 'createwallet' });

			let modalData = (
				<form className="was-validated">
				
					<div className="form-group float-label position-relative active">

						<select required id="create_currency" className="form-control text-white" onChange={this.handleCreateWalletChange}>
						  <option value=''></option>
						  {res.currencies.map((resitem, index) => (
						  	<option value={resitem.ticker}>{resitem.name}</option>
						  ))}
						</select>

						<label className="form-control-label text-white">Select Currency</label>
					</div>
				
					<div className="form-group float-label position-relative active">
						<input required id="create_password" type="password" className="form-control text-white" onChange={this.handleCreateWalletChange} autoComplete="new-password" />
						<label className="form-control-label text-white">Your Password</label>
					</div>

				</form>
			);

			store.dispatch( updateStore({ key: 'modalCode', value: modalData }) );
			store.dispatch( updateStore({ key: 'modalData', value: null }) );
			store.dispatch( updateStore({ key: 'modalButton', value: 'Create Wallet' }) );
			store.dispatch( updateStore({ key: 'modalTitle', value: 'Create New Wallet' }) );
			store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );
		
		})();
		
	};
	
	doModalCreateWallet = () => {

		//console.log('model button click');
		store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		var ticker = this.state.walletForm.create_currency || null;
		var password = this.state.walletForm.create_password || null;
	
		var error = false;
		
		if (ticker === null || ticker == '' || password === null || password == '')
		{
			error = true;
		}
		
		if (error === true)
		{
		
			toast.error('Form error');
		
		}
		else
		{

			(async () => {

				let res = await userService.createcryptowallet(ticker, password);

				if (res.status === true)
				{
				
					
					let res2 = await userService.get();
					
					store.dispatch( updateStore({ key: 'user', value: res2.user }) );
				
					toast.success(res.message);
	
				}
				else
				{
			
					toast.error(res.message);

				}

			})();
		
		}

	};

	createBankAccount = (e) => {

		e.preventDefault();
		
		
		
	};
	
	createDebitCard = (e) => {

		e.preventDefault();
		
		
		
	};
	
	getType = (type) => {
	
		var typetext = '';
	
		if (type === 0) typetext = 'Transfer';
		if (type === 1) typetext = 'SigReg';
		if (type === 2) typetext = 'DelReg';
		if (type === 3) typetext = 'Vote';
		if (type === 4) typetext = 'Multisig';
		if (type === 5) typetext = 'IPFS';
		if (type === 6) typetext = 'MultiTransfer';
		if (type === 7) typetext = 'DelResign';
		if (type === 8) typetext = 'HTLC';

		if (type === 20) typetext = 'Transfer';
		if (type === 21) typetext = 'Change';
		
		return typetext;
	
	};

	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		var wallets = {cards: [], accounts: [], crypto: []};
		
		if (this.state.user && this.state.user.wallets)
		{
		
			for (let i = 0; i < this.state.user.wallets.length; i++)
			{
			
				let thiswallet = this.state.user.wallets[i];
				
				if (thiswallet.typecode == 1) // Crypto
				{
					wallets.crypto.push(thiswallet);
				}
				else if (thiswallet.typecode == 2) // Account
				{
					wallets.accounts.push(thiswallet);
				}
				else if (thiswallet.typecode == 3) // Card
				{
					wallets.cards.push(thiswallet);
				}
			
			}
		
		}
					
		if (isLoggedIn === true)
		{
		
			if (!this.state.walletid || this.state.walletid === null)
			{

				return (
				<>
					<ReactTooltip />
					<div className="card">
						<div className="card-header">
							<h6 className="mb-0">Your Cards ({wallets.cards.length}) <img src="/img/icons/essential/svg/093-information.svg" style={{width:'16px',height:'16px', marginTop:'-8px'}} data-tip="This is a list of your Qredit Motion debit cards"/></h6>
						</div>
						<div className="hr-thin"></div>
						<div className="card-body px-0">

							<Swiper
							  spaceBetween={0}
							  slidesPerView='auto'
							  centeredSlides={true}
							  pagination={{ clickable: false }}
							  className="introduction text-white"
							  effect="coverflow"
							  preventClicks={false}
							  preventClicksPropagation={false}
							  onClick={ (s, e) => { e.preventDefault() }}
							>
						
							{wallets.cards.map((walletitem, index) => (
						
							  <SwiperSlide key={walletitem._id} className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

								 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': walletitem.currencyid.colorscheme}}>
								  <div className="card-header">
									<h6 className="mb-0">Visa <small>Virtual Card</small></h6>
								  </div>
								  <div className="card-body" style={{padding: '0px'}}>
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

							  </SwiperSlide>
						  
							))}


								<SwiperSlide key="0" className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

									 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': '#999'}}>
									  <div className="card-header">
									  	<h5 className="mb-0">New Card</h5>
									  </div>
									  <div className="card-body" style={{padding: '0px'}}>
										<div className="row">
										  <div className="col">
											<p className="mb-2 mt-2">Open New Debit Card</p>
										  </div>
										</div>
									  </div>
									  <div className="card-footer">
										<div className="row">
										  <div className="col">
											<p className="mb-0">
												<button className="btn btn-sm btn-outline-light" onClick={ e => this.createDebitCard(e) }> Open &#65291; </button>
											</p>
										  </div>
										</div>
									  </div>
									</div>
								
								</SwiperSlide>

								
							</Swiper>


						</div>		
					</div>	
				
					<div className="card">
						<div className="card-header">
							<h6 className="mb-0">Your Accounts ({wallets.accounts.length}) <img src="/img/icons/essential/svg/093-information.svg" style={{width:'16px',height:'16px', marginTop:'-8px'}} data-tip="This is a list of your Qredit Motion banking accounts"/></h6>
						</div>
						<div className="hr-thin"></div>
						<div className="card-body px-0">

							<Swiper
							  spaceBetween={0}
							  slidesPerView='auto'
							  centeredSlides={true}
							  pagination={{ clickable: false }}
							  className="introduction text-white"
							  effect="coverflow"
							  preventClicks={false}
							  preventClicksPropagation={false}
							  onClick={ (s, e) => { e.preventDefault() }}
							>
						
							{wallets.accounts.map((walletitem, index) => (
						
							  <SwiperSlide key={walletitem._id} className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

								 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': walletitem.currencyid.colorscheme}}>
								  <div className="card-header">
									<h6 className="mb-0">Savings Account</h6>
								  </div>
								  <div className="card-body">
									<h5 className="mb-0 mt-2">1234567890</h5>
								  </div>
								  <div className="card-footer">
									<div className="row">
									  <div className="col">
										<p className="mb-0">€ 0.00</p>
										<p className="small ">Balance</p>
									  </div>
									</div>
								  </div>
								</div>

							  </SwiperSlide>

							))}
						
						
								<SwiperSlide key="0" className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

									 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': '#999'}}>
									  <div className="card-header">
									  	<h5 className="mb-0">New Account</h5>
									  </div>
									  <div className="card-body" style={{padding: '0px'}}>
										<div className="row">
										  <div className="col">
											<p className="mb-2 mt-2">Open New Bank Account</p>
										  </div>
										</div>
									  </div>
									  <div className="card-footer">
										<div className="row">
										  <div className="col">
											<p className="mb-0">
												<button className="btn btn-sm btn-outline-light" onClick={ e => this.createBankAccount(e) }> Open &#65291; </button>
											</p>
										  </div>
										</div>
									  </div>
									</div>
								
								</SwiperSlide>
						
							</Swiper>


						</div>		
					</div>	


						
					<div className="card">
						<div className="card-header">
							<h6 className="mb-0">Your Crypto ({wallets.crypto.length}) <img src="/img/icons/essential/svg/093-information.svg" style={{width:'16px',height:'16px', marginTop:'-8px'}} data-tip="This is a list of your Qredit Motion cryptocurrency wallets"/></h6>
						</div>
						<div className="hr-thin"></div>
						<div className="card-body px-0 pb-2">

							<Swiper
							  spaceBetween={0}
							  slidesPerView='auto'
							  centeredSlides={true}
							  pagination={{ clickable: false }}
							  className="introduction text-white"
							  effect="coverflow"
							  preventClicks={false}
							  preventClicksPropagation={false}
							  onClick={ (s, e) => { e.preventDefault() }}
							>
						
							{wallets.crypto.map((walletitem, index) => (

							  <SwiperSlide key={walletitem._id} className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

								 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': walletitem.currencyid.colorscheme}}>
								  <div className="card-header">
									
									<h5 className="mb-0">{walletitem.currencyid.logo!==null?<img src={walletitem.currencyid.logo} style={{width:'24px', height: '24px', marginTop: '-4px', marginRight: '8px'}} />:""}{walletitem.currencyid.name} ({walletitem.currencyid.ticker})</h5>
								  </div>
								  <div className="card-body" style={{padding: '0px'}}>
									<div className="row">
									  <div className="col">
									  	<p className="small mb-0">Balance</p>
										<p className="mb-0">{parseFloat(walletitem.balance).toFixed(8)} {walletitem.currencyid.ticker}</p>
									  </div>
									</div>
								  </div>
								  <div className="card-footer">
									<div className="row">
									  <div className="col">
										<p className="mb-0">
											<button className="btn btn-sm btn-outline-light" id={walletitem._id} data-color={walletitem.currencyid.colorscheme} data-name={walletitem.currencyid.name} data-ticker={walletitem.currencyid.ticker} data-balance={parseFloat(walletitem.balance).toFixed(8)} onClick={ e => this.goToWallet(e) }>Details</button>
										</p>
									  </div>
									</div>
								  </div>
								</div>

							  </SwiperSlide>

							))}
							
							
								<SwiperSlide key="0" className="overflow-hidden text-center mb-5" style={{width: '350px', maxWidth:'100%', borderRadius:'15px', padding: '0px'}}>

									 <div className="card qredit-wallet-card textalwayswhite" style={{width:'350px', maxWidth:'100%', margin:'0px', 'backgroundColor': '#999'}}>
									  <div className="card-header">
									  	<h5 className="mb-0">New Wallet</h5>
									  </div>
									  <div className="card-body" style={{padding: '0px'}}>
										<div className="row">
										  <div className="col">
											<p className="mb-2 mt-2">Create New Crypto Wallet</p>
										  </div>
										</div>
									  </div>
									  <div className="card-footer">
										<div className="row">
										  <div className="col">
											<p className="mb-0">
												<button className="btn btn-sm btn-outline-light" onClick={ e => this.createWallet(e) }> Add &#65291; </button>
											</p>
										  </div>
										</div>
									  </div>
									</div>
								
								</SwiperSlide>
						
							</Swiper>


						</div>		
					</div>	
				</>
				);
			
			}
			else if (this.state.walletticker !== 'EUR')
			{
			
				const walletaddresses = this.state.walletaddresses || [];
				const transactionlist = this.state.transactionlist || [];

				return (
					<>
						<button className="btn btn-link back-btn" type="button" onClick={ e => this.goBack(e) } style={{paddingLeft:'0px'}}>
							<span className="material-icons">keyboard_arrow_left</span>
							Back to Wallets
						</button>
						<div className="card">
							<div className="card-header textalwayswhite" style={{'backgroundColor': this.state.walletcolor}}>
								<h6 className="mb-0">{this.state.walletname} ({this.state.walletticker})<span style={{float:'right'}}>{this.state.walletbalance}</span></h6>
							</div>
							<div className="card-body px-0 pt-0 pb-0" style={{minHeight: '150px'}}>

								<div id="spinoverlay" style={this.state.loadingwallet && this.state.loadingwallet===true?{}:{display:'none'}}>
									<div className="spinloader"></div>
								</div>

								<div className="card bg-blocks shadow-default text-center" style={{borderTopRightRadius:'0px', borderTopLeftRadius:'0px'}}>
									<div className="card-body row">
										<div className="text-center col">
											<a onClick={ e => this.doDeposit(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/009-plus.svg")'}} />
												</div>
												<p>
													<small>Deposit</small>
												</p>
											</a>
										</div>
										<div className="text-center col">
											<a onClick={ e => this.doSend(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/030-send.svg")'}} />
												</div>
												<p>
													<small>Send</small>
												</p>
											</a>
										</div>
										<div className="text-center col">
											<a onClick={ e => this.doPayReceive(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/015-check.svg")'}} />
												</div>
												<p>
													<small>Request</small>
												</p>
											</a>
										</div>
										{this.state.walletticker === 'XQR'?(
										<div className="text-center col">
											<a onClick={ e => this.doVote(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/050-pencil.svg")'}} />
												</div>
												<p>
													<small>Vote</small>
												</p>
											</a>
										</div>
										):''}
									</div>							
								</div>
								<div className="card mt-1">
									<div className="card-header pb-0">
										<h6 className="mb-0">Addresses</h6>
									</div>
									<div className="card-body px-0 pt-1">

										<div className="list-group list-group-flush">

												{walletaddresses.map((addressitem, index) => (

													<div key={index} className="row">
														<div className="col pl-4 pr-4">
															<div className="row mb-1">
																<div className="col">
																	<p className="mb-0" onClick={ e => this.doCopyAddress(e, addressitem.address) } style={{cursor:'pointer'}}>{addressitem.address}</p>
																</div>
															</div>
															<p className="small text-secondary">Created: {addressitem.createdAt?addressitem.createdAt.substr(0,19).replace('T',' '):''} UTC</p>
														</div>

													</div>
							
												))}
						
										</div>

									</div>
								</div>
								<div className="card mt-1">
									<div className="card-header pb-0">
										<h6 className="mb-0">Transactions</h6>
									</div>
									<div className="card-body px-0 pt-1">

										<div className="list-group list-group-flush">
						
						
											<InfiniteScroll
												dataLength={transactionlist.length}
												next={this.fetchMoreData}
												hasMore={this.state.hasMore || false}
												loader={
													<p style={{ textAlign: "center" }}>
													  <b>Loading...</b>
													</p>
												}
												height={500}
												endMessage={
													this.state.initialLoad === true?(
													<p style={{ textAlign: "center" }}>
													  <b>Loading...</b>
													</p>
													):(
													<p style={{ textAlign: "center" }}>
													  <b>No More Records</b>
													</p>
													)
												}
											>
												{transactionlist.map((transactionitem, index) => (

												<a key={index} className="list-group-item" onClick={ e => this.viewTransaction(e, transactionitem._id) } href="/" style={{textDecoration:'none'}}>
													<div className="row bg-transactions">
													 <div className="col-auto">
													      <div className="avatar avatar-40 text-default">
                             								 <figure className="m-0 background icon icon-24" style={{backgroundImage: (transactionitem.direction==='in'?'url("/img/icons/essential/svg/009-plus.svg")':'url("/img/icons/essential/svg/030-send.svg")')}}></figure>
                            							  </div>
													</div>
													<div className="col align-self-center pl-0">
													<div className="text-default">
															<h6 className={"text-" + (transactionitem.direction==='in'?'success':'danger')}>{(transactionitem.direction==='in'?'+':'-')}{parseFloat(transactionitem.amount).toFixed(8) + ' ' + this.state.walletticker}</h6>
														</div>
                                      				  <h6 className="mb-1" onClick={ e => this.doCopyTxid(e, transactionitem.details.id) }>{'ID: ' + transactionitem.details.id.substr(0,7) + '...' + transactionitem.details.id.substr(-7)}</h6>
                                    				</div>
													
														<div className="col pl-2">
															<div className="row mb-1">
																<div className="col">
																	<p className="small text-secondary mb-0"><strong>Timestamp:</strong>&nbsp;{transactionitem.details.timestamp.human.substr(0,19).replace('T',' at ')}</p>
																	<p className="small text-secondary"><strong>Type:</strong>&nbsp;{transactionitem.internaltype}</p>

																</div>
															</div>
														</div>
													</div>
													<div className="hr-thin"></div>
												</a>
							
												))}
											</InfiniteScroll>
						

										</div>

									</div>
								</div>	
							</div>				
						</div>
					</>
				);
			
			}
			else if (this.state.walletticker === 'EUR')
			{
			
				const walletaddresses = this.state.walletaddresses || [];
				const transactionlist = this.state.transactionlist || [];

				return (
					<>
						<button className="btn btn-link back-btn" type="button" onClick={ e => this.goBack(e) } style={{paddingLeft:'0px'}}>
							<span className="material-icons">keyboard_arrow_left</span>
							Back to Wallets
						</button>
						<div className="card">
							<div className="card-header textalwayswhite" style={{'backgroundColor': this.state.walletcolor}}>
								<h6 className="mb-0">{this.state.walletname} ({this.state.walletticker})<span style={{float:'right'}}>{this.state.walletbalance}</span></h6>
							</div>
							<div className="card-body px-0 pt-0 pb-0" style={{minHeight: '150px'}}>

								<div id="spinoverlay" style={this.state.loadingwallet && this.state.loadingwallet===true?{}:{display:'none'}}>
									<div className="spinloader"></div>
								</div>

								<div className="card bg-blocks shadow-default text-center" style={{borderTopRightRadius:'0px', borderTopLeftRadius:'0px'}}>
									<div className="card-body row">
										<div className="text-center col">
											<a onClick={ e => this.doDeposit(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/009-plus.svg")'}} />
												</div>
												<p>
													<small>Deposit</small>
												</p>
											</a>
										</div>
										<div className="text-center col">
											<a onClick={ e => this.doSend(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/030-send.svg")'}} />
												</div>
												<p>
													<small>Send</small>
												</p>
											</a>
										</div>
										<div className="text-center col">
											<a onClick={ e => this.doPayReceive(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/015-check.svg")'}} />
												</div>
												<p>
													<small>Request</small>
												</p>
											</a>
										</div>
										{this.state.walletticker === 'XQR'?(
										<div className="text-center col">
											<a onClick={ e => this.doVote(e) } href="/" className="text-white">
												<div className="icon icon-40 mb-2">
													<figure className="m-0 background" style={{backgroundImage: 'url("/img/icons/essential/svg/050-pencil.svg")'}} />
												</div>
												<p>
													<small>Vote</small>
												</p>
											</a>
										</div>
										):''}
									</div>							
								</div>
								<div className="card mt-1">
									<div className="card-header pb-0">
										<h6 className="mb-0">Addresses</h6>
									</div>
									<div className="card-body px-0 pt-1">

										<div className="list-group list-group-flush">

												{walletaddresses.map((addressitem, index) => (

													<div key={index} className="row">
														<div className="col pl-4 pr-4">
															<div className="row mb-1">
																<div className="col">
																	<p className="mb-0" onClick={ e => this.doCopyAddress(e, addressitem.address) } style={{cursor:'pointer'}}>{addressitem.address}</p>
																</div>
															</div>
															<p className="small text-secondary">Created: {addressitem.createdAt?addressitem.createdAt.substr(0,19).replace('T',' '):''} UTC</p>
														</div>

													</div>
							
												))}
						
										</div>

									</div>
								</div>
								<div className="card mt-1">
									<div className="card-header pb-0">
										<h6 className="mb-0">Transactions</h6>
									</div>
									<div className="card-body px-0 pt-1">

										<div className="list-group list-group-flush">
						
						
											<InfiniteScroll
												dataLength={transactionlist.length}
												next={this.fetchMoreData}
												hasMore={this.state.hasMore || false}
												loader={
													<p style={{ textAlign: "center" }}>
													  <b>Loading...</b>
													</p>
												}
												height={500}
												endMessage={
													this.state.initialLoad === true?(
													<p style={{ textAlign: "center" }}>
													  <b>Loading...</b>
													</p>
													):(
													<p style={{ textAlign: "center" }}>
													  <b>No More Records</b>
													</p>
													)
												}
											>
												{transactionlist.map((transactionitem, index) => (

												<a key={index} className="list-group-item" onClick={ e => this.viewTransaction(e, transactionitem._id) } href="/" style={{textDecoration:'none'}}>
													<div className="row bg-transactions">
													 <div className="col-auto">
													      <div className="avatar avatar-40 text-default">
                             								 <figure className="m-0 background icon icon-24" style={{backgroundImage: (transactionitem.direction==='in'?'url("/img/icons/essential/svg/009-plus.svg")':'url("/img/icons/essential/svg/030-send.svg")')}}></figure>
                            							  </div>
													</div>
													<div className="col align-self-center pl-0">
													<div className="text-default">
															<h6 className={"text-" + (transactionitem.direction==='in'?'success':'danger')}>{(transactionitem.direction==='in'?'+':'-')}{parseInt(transactionitem.details.amount)/100000000 + ' XQR'}</h6>
														</div>
                                      				  <h6 className="mb-1" onClick={ e => this.doCopyTxid(e, transactionitem.details.id) }>{'ID: ' + transactionitem.details.id.substr(0,7) + '...' + transactionitem.details.id.substr(-7)}</h6>
                                    				</div>
													
														<div className="col pl-2">
															<div className="row mb-1">
																<div className="col">
																	<p className="small text-secondary mb-0"><strong>Timestamp:</strong>&nbsp;{transactionitem.details.timestamp.human.substr(0,19).replace('T',' at ')}</p>
																	<p className="small text-secondary mb-0"><strong>Wallet:</strong>&nbsp;{transactionitem.details.recipient}</p>
																	<p className="small text-secondary"><strong>Type:</strong>&nbsp;{this.getType(transactionitem.details.type)}&nbsp;&nbsp;<strong>Fee:</strong>&nbsp;{parseInt(transactionitem.details.fee)/100000000}</p>

																</div>
															</div>
														</div>
													</div>
													<div className="hr-thin"></div>
												</a>
							
												))}
											</InfiniteScroll>
						

										</div>

									</div>
								</div>	
							</div>				
						</div>
					</>
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

export default Wallet;
