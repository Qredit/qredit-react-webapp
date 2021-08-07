import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';


class Notifications extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();

		this.state.notificationhistory = [];
		this.state.hasMore = false;
		this.state.shownItems = 10;
		
	}

	componentDidMount(){

		(async () => {
		
			this.unsubscribe = store.subscribe(() => {
				this.setState(store.getState());
			}); 

			let res = await userService.getnotificationhistory(0, 10);

			if (res.status === true)
			{
				this.setState({'notificationhistory': res.notificationhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
		
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	refresh = () => {
	
		(async () => {
		
			this.setState({ shownItems: 10 });
		
			let res = await userService.getnotificationhistory(0, 10);

			if (res.status === true)
			{
				this.setState({'notificationhistory': res.notificationhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
	};
	
	fetchMoreData = () => {
	
		(async () => {
		
			var currentCount = this.state.shownItems;
			var newCount = currentCount + 10;
			var skip = newCount - 10;
			var limit = 10;
		
			this.setState({ shownItems: newCount });
		
			let res = await userService.getnotificationhistory(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.notificationhistory.concat(res.notificationhistory);
			
				this.setState({'notificationhistory': newhistory});
				this.setState({'hasMore': res.hasmore});
			}
		
		})();
	};

	viewNotification = (e, id) => {
	
		(async () => {
				
			let res = await userService.getnotification(id);

			if (res.status === true)
			{
				console.log(res);
			}
		
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
			
		if (isLoggedIn === true)
		{

			return (
				<div className="card">
                    <div className="card-header">
                        <h6 className="mb-0">Notifications</h6>
                    </div>
                    <div className="card-body px-0">
                        <div className="list-group list-group-flush">
                        
                        
							<InfiniteScroll
								dataLength={this.state.notificationhistory.length}
								next={this.fetchMoreData}
								hasMore={this.state.hasMore}
								loader={
									<p style={{ textAlign: "center" }}>
									  <b>Loading...</b>
									</p>
								}
								height={500}
								endMessage={
									<p style={{ textAlign: "center" }}>
									  <b>No More Records</b>
									</p>
								}
							>
								{this.state.notificationhistory.map((historyitem, index) => (

								<a key={index} className={historyitem.isread===false?'list-group-item bg-default-light':'list-group-item'} onClick={ e => this.viewNotification(e, historyitem._id) } href="/">
									<div className="row">
										<div className="col-auto align-self-center">
											<i className="material-icons text-default">{historyitem.icon}</i>
										</div>
										<div className="col pl-0">
											<div className="row mb-1">
												<div className="col">
													<p className="mb-0">{historyitem.title}</p>
												</div>
												<div className="col-auto pl-0">
													<p className="small text-secondary">{historyitem.created_date}</p>
												</div>
											</div>
											<p className="small text-secondary">{historyitem.subtitle}</p>
										</div>

									</div>
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

export default Notifications;
