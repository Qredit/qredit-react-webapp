import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';


class AppservicesPhone extends React.Component {

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
    

	handlePhoneFormChange = event => {
		
		store.dispatch( updateStore({ key: 'phoneForm', value: event.target.value }) );
		
	};

	handlePinFormChange = event => {
	
		store.dispatch( updateStore({ key: 'pinForm', value: event.target.value }) );
		
	};

	getPinCode = (e) => {
	
		e.preventDefault();
		
		(async () => {
		
			let res = await userService.getpincode(this.state.phoneForm);
			
			if (res.status === true)
			{
			
				toast.success(res.message);				
				store.dispatch( updateStore({ key: 'phoneForm', value: res.phone}) );

			}
			else
			{
				toast.error(res.message);
			}
		
		})();
		
	};

	submitPinCode = (e) => {
	
		e.preventDefault();

		(async () => {
		
			let res = await userService.submitpincode(this.state.phoneForm, this.state.pinForm);
			
			if (res.status === true)
			{
				toast.success(res.message);
				store.dispatch( updateStore({ key: 'phoneForm', value: null }) );
				store.dispatch( updateStore({ key: 'pinForm', value: null }) );

				this.setState({initialLoad: true});
		
				let res = await userService.getuserphones();
			
				if (res.status === true)
				{

					this.setState({phonelist: res.phonelist, initialLoad: false});

				}
				else
				{
				
					this.setState({initialLoad: false});
				
				}
				
			}
			else
			{
				toast.error(res.message);
			}
		
		})();
		
	};

	setShowItem = (show) => {
		
		this.setState({showitem: show});
		
		if (show === true)
		{
		
			(async () => {
			
				this.setState({initialLoad: true});
		
				let res = await userService.getuserphones();
			
				if (res.status === true)
				{

					this.setState({phonelist: res.phonelist, initialLoad: false});

				}
				else
				{
				
					this.setState({initialLoad: false});
				
				}
		
			})();
		
		}
		else
		{
		
			store.dispatch( updateStore({ key: 'phoneForm', value: null }) );
			store.dispatch( updateStore({ key: 'pinForm', value: null }) );
				
		}

	};

	setPrimary = (id) => {
	
		(async () => {
			
			let res = await userService.setprimaryphone(id);
		
			if (res.status === true)
			{
				this.setState({initialLoad: true});
		
				let restwo = await userService.getuserphones();
				
				if (restwo.status === true)
				{
				
					this.setState({phonelist: restwo.phonelist, initialLoad: false});

				}
				else
				{
			
					this.setState({initialLoad: false});
			
				}
			
			}
	
		})();
	
	};

	showAddPhone = () => {
	
		this.setState({showAddNew: true});
	
	};

	hideAddPhone = () => {
	
		this.setState({showAddNew: false});
	
	};
	
	render() {

		const phonelist = this.state.phonelist || [];

		return (
			<CSSTransition in={this.state.appservicesItem === 'phones'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card-body pt-0 px-0 mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
				
					<button className="btn btn-block btn-success rounded" onClick={ e => this.showAddPhone(e) } style={this.state.showAddNew===true?{display:'none'}:{}}>Add New Phone</button>

				
                    <div className="card-body" style={this.state.showAddNew===true?{}:{display:'none'}}>
                        <div className={"form-group float-label " + (this.state.phoneForm?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="phone" onChange={this.handlePhoneFormChange} value={this.state.phoneForm || ''}/>
                            <label className="form-control-label">Add Phone</label>
                        	<button className="btn btn-block btn-default rounded" disabled={!this.state.phoneForm} onClick={ e => this.getPinCode(e) }>Get Pin Code</button>
                        </div>
                        <div className={"form-group float-label " + (this.state.pinForm?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="pin" onChange={this.handlePinFormChange} value={this.state.pinForm || ''}/>
                            <label className="form-control-label">Enter Pin</label>
							<button className="btn btn-block btn-default rounded" disabled={!this.state.pinForm} onClick={ e => this.submitPinCode(e) }>Submit Pin Code</button>
							<button className="btn btn-block btn-danger rounded" onClick={ e => this.hideAddPhone(e) } >Cancel</button>
                        </div>
                    </div>
                    

					<div className="card-header pb-0">
						<h6 className="mb-0">Your Phones</h6>
						<div className="hr-thin"></div>
					</div>
					<ul className="list-group list-group-flush">
					
						<InfiniteScroll
							dataLength={phonelist.length}
							hasMore={false}
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
					
						{phonelist.map((phoneitem, index) => (
						
							<li className="list-group-item">
								<div key={index}>
									{phoneitem.phone} ({phoneitem.country}) - <span style={{color: 'green'}}>Verified</span> {phoneitem.isprimary === true?(<span style={{color: 'green'}}>Primary</span>):(<span onClick={this.setPrimary(phoneitem._id)}>Set Primary</span>)}
								</div>

								<div className="hr-thin"></div>
							</li>
							
						))}
						
						</InfiniteScroll>

					</ul>
					
				</div>

			</CSSTransition>
		);


	}
	
}

export default AppservicesPhone;