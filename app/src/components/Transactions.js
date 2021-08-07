import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";
import copy from "copy-to-clipboard";

// SERVICES
import userService from '../services/userService';


class Transactions extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		
		this.refresh();
		
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

	refresh = () => {
	
		(async () => {
		
			this.setState({ shownItems: 10, initialLoad: true });
		
			let res = await userService.getalltransactions(0, 10);

			if (res.status === true)
			{
				this.setState({'transactionlist': res.transactionlist});
				this.setState({'hasMore': res.hasmore});
				this.setState({'initialLoad': false});
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
		
			let res = await userService.getalltransactions(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.transactionlist.concat(res.transactionlist);
			
				this.setState({'transactionlist': newhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
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
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		const transactionlist = this.state.transactionlist || [];

		if (isLoggedIn === true)
		{

			return (
								<div className="card mt-1">
									<div className="card-header pb-0">
										<h6 className="mb-0">All Transactions</h6>
										<div className="hr-thin"></div>
									</div>
									<div className="card-body px-0 pt-1">

										<div className="list-group list-group-flush">
						
						
											<InfiniteScroll
												dataLength={transactionlist.length}
												next={this.fetchMoreData}
												hasMore={this.state.hasMore|| false}
												loader={
													<p style={{ textAlign: "center" }}>
													  <b>Loading...</b>
													</p>
												}
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
														<div className="avatar avatar-40 text-default" style={{marginTop:'-8px'}}>
                             								<figure className="m-0 background icon icon-24" style={{backgroundImage: (transactionitem.direction==='in'?'url("/img/icons/essential/svg/009-plus.svg")':'url("/img/icons/essential/svg/030-send.svg")')}}></figure>
                            							</div>
                            							  
														<div className="card textalwayswhite" style={{borderRadius: '5px', width:'40px', maxWidth:'100%', height: '28px', margin:'auto', marginBottom: '2px', backgroundColor: transactionitem.walletid.currencyid.colorscheme}}>
															<div className="card-body" style={{textAlign:'center', padding: '0px'}}>
																{transactionitem.walletid.currencyid.logo!==null?<img src={transactionitem.walletid.currencyid.logo} style={{width:'24px', height: '24px', marginTop: '2px'}} />:transactionitem.walletid.currencyid.ticker}
															</div>
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

export default Transactions;
