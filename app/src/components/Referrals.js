import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";
import copy from "copy-to-clipboard";

// SERVICES
import userService from '../services/userService';


class Referrals extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		
		this.refresh();
		this.rrefresh();
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

	handleInviteFormChange = event => {

		this.setState({inviteinfo: event.target.value});

	};
	
	doInvitation = (e) => {

		e.preventDefault();

		(async () => {
		
		
			let res = await userService.createinvitation(this.state.inviteinfo);

			if (res.status === true)
			{
				toast.success(res.message);
			}
			else
			{
				toast.error(res.message);
			}
			
			this.refresh();
		
		})();
	};
	
	refresh = () => {
	
		(async () => {
		
			this.setState({ shownItems: 10, initialLoad: true });
		
			let res = await userService.getinvitations(0, 10);

			if (res.status === true)
			{
				this.setState({'invitationlist': res.invitationlist});
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
		
		
			let res = await userService.getinvitations(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.invitationlist.concat(res.invitationlist);
			
				this.setState({'invitationlist': newhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
	};
	
	rrefresh = () => {
	
		(async () => {
		
			this.setState({ rshownItems: 10, rinitialLoad: true });
		
			let res = await userService.getreferrals(0, 10);

			if (res.status === true)
			{
				this.setState({'referrallist': res.referrallist});
				this.setState({'rhasMore': res.hasmore});
				this.setState({'rinitialLoad': false});
			}
		
		})();
	};
	
	rfetchMoreData = () => {
	
		(async () => {
		
			var currentCount = this.state.rshownItems || 10;
			var newCount = currentCount + 10;
			var skip = newCount - 10;
			var limit = 10;
		
			this.setState({ rshownItems: newCount });
		
		
			let res = await userService.getreferrals(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.referrallist.concat(res.referrallist);
			
				this.setState({'referrallist': newhistory});
				this.setState({'rhasMore': res.hasmore});
			}
		
		})();
	};
	
	
	doCopyLink = (e, link) => {

		e.preventDefault();
		
		copy(link);
		
		toast.success('Link Copied to Clipboard');
		
	};
	
	emailMasking
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		const invitationlist = this.state.invitationlist || [];
		const referrallist = this.state.referrallist || [];

			
		if (isLoggedIn === true)
		{

			let inviteLink = "https://motion.qredit.cloud?invite=" + (this.state.user._id || '');
			
			let facebookLink = "https://www.facebook.com/sharer/sharer.php?u=" + inviteLink;
			let twitterLink = "https://twitter.com/intent/tweet?url=" + inviteLink;
			let whatsappLink = "whatsapp://send?text=" + inviteLink;

			
			return (

        <div className="main-container">
        
            <div className="container mb-4">
                <div className="card border-0 mb-3">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-1 pr-0">
                                <div className="avatar avatar-50 border-0 bg-danger-light rounded-circle text-danger mb-3">
                                    <p className="" style={{fontSize: 'xx-large'}}>1</p>
                                </div>
                            </div>
                            <div className="col-md-3 align-self-center">
                                <h6 className="mb-1">Copy your referral code</h6>
                                <p className="small text-secondary mb-4">You can find your referral code below</p>
                            </div>
                            <div className="col-md-1 pr-0">
                                <div className="avatar avatar-50 border-0 bg-danger-light rounded-circle text-danger mb-3">
                                    <p className="" style={{fontSize: 'xx-large'}}>2</p>
                                </div>
                            </div>
                            <div className="col-md-3 align-self-center">
                                <h6 className="mb-1">Refer friends and family</h6>
                                <p className="small text-secondary mb-4">Refer friends and family by sharing your referral code!</p>
                            </div>
                            <div className="col-md-1 pr-0">
                                <div className="avatar avatar-50 border-0 bg-danger-light rounded-circle text-danger mb-3">
                                    <p className="" style={{fontSize: 'xx-large'}}>3</p>
                                </div>
                            </div>
                            <div className="col-md-3 align-self-center">
                                <h6 className="mb-1">Earn Rewards!</h6>
                                <p className="small text-secondary mb-4">Earn Qredit coins!</p>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="col-md-12 align-self-center text-center">
                        <h6>For every referral that succesfully subscribes to a year subscription you will receive 2500 XQR within 24 hours.</h6>
                    </div>
                </div>
            </div>
            <div className="container mb-4">
                <div className="alert alert-success d-none" id="successmessage">Refferal link copied</div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="refferal Link" value={inviteLink}
                        id="referallink" />
                    <div className="input-group-append">
                        <button className="btn btn-default rounded" type="button" id="coplink" onClick={ e => this.doCopyLink(e, inviteLink) }>Copy link</button>
                    </div>
                </div>
                <p className="text-center text-secondary">Share link to social</p>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <div className="avatar avatar-40 rounded mx-2">
                            <div className="background">
                                <a href={whatsappLink} target="_new"><img src="img/whatsapp.png" alt="" /></a>
                            </div>
                        </div>
                        <div className="avatar avatar-40 rounded mx-2">
                            <div className="background">
                                <a href={facebookLink} target="_new"><img src="img/facebook.png" alt="" /></a>
                            </div>
                        </div>
                        <div className="avatar avatar-40 rounded mx-2">
                            <div className="background">
                                <a href={twitterLink} target="_new"><img src="img/twitter.png" alt="" /></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="hr-thin mb-4"></div>
            <div className="container mb-4">

                <div className="input-group mb-4">
                    <input type="text" className="form-control" placeholder="Email address / Phone Number" onChange={this.handleInviteFormChange} />
                    <div className="input-group-append">
                        <button className="btn btn-default rounded" type="button" id="button-addon2" onClick={ e => this.doInvitation(e) }>Invite</button>
                    </div>
                </div>
                
                
				<div className="card mt-1">
					<div className="card-header pb-0">
						<h6 className="mb-0">Invitations</h6>
						<div className="hr-thin"></div>
					</div>
					<div className="card-body px-0 pt-1">

						<div className="list-group list-group-flush">
		
		
							<InfiniteScroll
								dataLength={invitationlist.length}
								next={this.fetchMoreData}
								hasMore={this.state.hasMore|| false}
								height={200}
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
								{invitationlist.map((invitationitem, index) => (

									<>
									<div className="row bg-transactions">
										<div className="col pl-5">
											{invitationitem.email || invitationitem.phone}
										</div>
										<div className="col align-self-center pl-0">
											<strong style={{textTransform: 'uppercase'}}>{invitationitem.status}</strong>
										</div>
									</div>
									<div className="hr-thin ml-4"></div>
									</>
			
								))}
							</InfiniteScroll>
		

						</div>

					</div>
				</div>	

				<div className="card mt-1">
					<div className="card-header pb-0">
						<h6 className="mb-0">Referrals</h6>
						<div className="hr-thin"></div>
					</div>
					<div className="card-body px-0 pt-1">

						<div className="list-group list-group-flush">
		
		
							<InfiniteScroll
								dataLength={referrallist.length}
								next={this.rfetchMoreData}
								hasMore={this.state.rhasMore|| false}
								height={300}
								loader={
									<p style={{ textAlign: "center" }}>
									  <b>Loading...</b>
									</p>
								}
								endMessage={
									this.state.rinitialLoad === true?(
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
								{referrallist.map((referralitem, index) => (

									<>
									<div className="row bg-transactions">
										<div className="col pl-5">
											{referralitem.givenname} {referralitem.familyname.substr(0,1)} ({referralitem.email.replace(/^(.)(.*)(.@.*)$/,(_, a, b, c) => a + b.replace(/./g, '*') + c).split('**').join('*')})
										</div>
										<div className="col align-self-center pl-0">
											{referralitem.pricingplan || 'No Plan Selected'}
										</div>
									</div>
									<div className="hr-thin ml-4"></div>
									</>
			
								))}
							</InfiniteScroll>
		

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

export default Referrals;
