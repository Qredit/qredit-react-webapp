import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';


class Loginhistory extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.loginhistory = [];
		this.state.hasMore = false;
		this.state.shownItems = 10;

	}

	componentDidMount(){

		
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
		
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }

	refresh = () => {
	
		(async () => {
		
			this.setState({ shownItems: 10 });
		
			let res = await userService.getloginhistory(0, 10);

			if (res.status === true)
			{
				this.setState({'loginhistory': res.loginhistory});
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
		
			let res = await userService.getloginhistory(skip, limit);

			if (res.status === true)
			{
			
				let newhistory = this.state.loginhistory.concat(res.loginhistory);
			
				this.setState({'loginhistory': newhistory});
				this.setState({'hasMore': res.hasmore});
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
	
	parseJsonRegion = (jsonstring) => {
		let data = JSON.parse(jsonstring);
		return data.city + ', ' + data.regionName + ', ' + data.country;
	};
	
	setShowItem = (show) => {
		
		this.setState({showitem: show});
		
		if (show === true)
		{
			this.refresh();
		}

	};
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		const loginHistory = this.state.loginhistory || [];
			
		if (isLoggedIn === true)
		{

			return (
				<CSSTransition in={this.state.appservicesItem === 'loginhistory'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card mt-2" style={this.state.showitem===true?{}:{display:'none'}}>
                    <div className="card-body px-0 pt-0">
                        <div className="list-group list-group-flush border-top border-color">


							<InfiniteScroll
								dataLength={loginHistory.length}
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
							>
								{loginHistory.map((historyitem, index) => (
							
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
													<p className="small text-secondary" style={{marginBottom:'0px',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{this.parseJsonRegion(historyitem.ip_region)}</p>
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
                
                </CSSTransition>
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

export default Loginhistory;
