import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';


class Contacthistory extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.contacthistory = [];
		this.state.hasMore = false;
		this.state.shownItems = 10;

	}

	componentDidMount(){
	
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		
		let contactid = this.state.requestedPageExtra;
		
		(async () => {
		
			//let res = await userService.getcontacthistory(contactid, 0, 10);

			//if (res.status === true)
			//{
			//	this.setState({'contacthistory': res.contacthistory});
			//	this.setState({'hasMore': res.hasmore});
			//}
		
		})();
		
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	refresh = () => {
	
		let contactid = this.state.requestedPageExtra;
	
		(async () => {
		
			this.setState({ shownItems: 10 });
		
			//let res = await userService.getcontacthistory(contactid, 0, 10);

			//if (res.status === true)
			//{
			//	this.setState({'contacthistory': res.contacthistory});
			//	this.setState({'hasMore': res.hasmore});
			//}
		
		})();
	};
	
	fetchMoreData = () => {
	
		let contactid = this.state.requestedPageExtra;

		(async () => {
		
			var currentCount = this.state.shownItems;
			var newCount = currentCount + 10;
			var skip = newCount - 10;
			var limit = 10;
		
			this.setState({ shownItems: newCount });
		
			//let res = await userService.getcontacthistory(contactid, skip, limit);

			//if (res.status === true)
			//{
			
			//	let newhistory = this.state.contacthistory.concat(res.contacthistory);
			
			//	this.setState({'contacthistory': newhistory});
			//	this.setState({'hasMore': res.hasmore});
			//}
		
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
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		const contactHistory = this.state.contacthistory || [];
			
		if (isLoggedIn === true)
		{

			return (
				<div className="card mt-2">
					<div className="card-header">
						<h6 className="mb-0">Transfer History</h6>
					</div>
                    <div className="card-body px-0 pt-0">
                        <div className="list-group list-group-flush border-top border-color">


							<InfiniteScroll
								dataLength={contactHistory.length}
								next={this.fetchMoreData}
								hasMore={this.state.hasMore}
								loader={
									<p style={{ textAlign: "center" }}>
									  <b>Loading...</b>
									</p>
								}
								height={400}
								endMessage={
									<p style={{ textAlign: "center" }}>
									  <b>No More Records</b>
									</p>
								}
								refreshFunction={this.refresh}
								pullDownToRefresh
								pullDownToRefreshThreshold={50}
								pullDownToRefreshContent={
									<p style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</p>
								}
								releaseToRefreshContent={
									<p style={{ textAlign: 'center' }}>&#8593; Release to refresh</p>
								}
							>
								{contactHistory.map((historyitem, index) => (
							
								<li key={index} className="list-group-item border-color">
									<div className="row">
										<div className="col">
											<div className="row mb-1">
												<div className="col">
													<p className="mb-0">{historyitem.ip_address}</p>
												</div>
												<div className="col-auto pl-0">
													<p className="small text-secondary">{historyitem.created_date}</p>
												</div>
											</div>
											<div className="row">
												<div className="col">
													<p className="small text-secondary" style={{marginBottom:'0px',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}></p>
												</div>
												<div className="col-auto pl-0">
													<p className="small" style={(historyitem.invalidated===true?{color:'red'}:{color:'green'})}>{(historyitem.invalidated===true?'Expired':'Active')}</p>
												</div>
											</div>
											<p className="small text-secondary" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{historyitem.useragent}</p>
										</div>
									</div>
								</li>
							
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

export default Contacthistory;
