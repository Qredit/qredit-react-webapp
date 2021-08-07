import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';


class AppservicesAddress extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		if (!this.state.addressForm) this.state.addressForm = {};

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		}); 
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }
    

	handleAddressFormChange = event => {

		var currentAddressForm = this.state.addressForm;
		
		currentAddressForm[event.target.id] = event.target.value;

		store.dispatch( updateStore({ key: 'addressForm', value: currentAddressForm }) );
		
	};

	addAddress = (e) => {
	
		e.preventDefault();
		
		(async () => {
		
			let res = await userService.addnewaddress(this.state.addressForm);
			
			if (res.status === true)
			{
			
				toast.success(res.message);				
				store.dispatch( updateStore({ key: 'addressForm', value: {}}) );

				this.setState({initialLoad: true});
		
				let res = await userService.getuseraddresses();
			
				if (res.status === true)
				{

					this.setState({addresslist: res.addresslist, initialLoad: false});

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
		
				let res = await userService.getuseraddresses();
			
				if (res.status === true)
				{

					this.setState({addresslist: res.addresslist, initialLoad: false});

				}
				else
				{
				
					this.setState({initialLoad: false});
				
				}
		
			})();
		
		}
		else
		{
		
			store.dispatch( updateStore({ key: 'addressForm', value: {} }) );
				
		}

	};

	showAddAddress = () => {
	
		this.setState({showAddNew: true});
	
	};

	hideAddAddress = () => {
	
		this.setState({showAddNew: false});
	
	};
	
	setPrimary = (id) => {
	
		(async () => {
			
			let res = await userService.setprimaryaddress(id);
		
			if (res.status === true)
			{
				this.setState({initialLoad: true});
		
				let restwo = await userService.getuseraddresses();
				
				if (restwo.status === true)
				{
				
					this.setState({addresslist: restwo.addresslist, initialLoad: false});

				}
				else
				{
			
					this.setState({initialLoad: false});
			
				}
			
			}
	
		})();
	
	};

	
	render() {

		const addresslist = this.state.addresslist || [];

		return (
			<CSSTransition in={this.state.appservicesItem === 'addresses'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card-body pt-0 px-0 mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
				
					<button className="btn btn-block btn-success rounded" onClick={ e => this.showAddAddress(e) } style={this.state.showAddNew===true?{display:'none'}:{}}>Add New Address</button>

                    <div className="card-body" style={this.state.showAddNew===true?{}:{display:'none'}}>
                        <div className={"form-group float-label " + (this.state.addressForm.line1?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="line1" onChange={this.handleAddressFormChange} value={this.state.addressForm.line1 || ''}/>
                            <label className="form-control-label">Address Line 1</label>
                        </div>
                        <div className={"form-group float-label " + (this.state.addressForm.line2?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="line2" onChange={this.handleAddressFormChange} value={this.state.addressForm.line2 || ''}/>
                            <label className="form-control-label">Address Line 2</label>
                        </div>
                        <div className={"form-group float-label " + (this.state.addressForm.city?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="city" onChange={this.handleAddressFormChange} value={this.state.addressForm.city || ''}/>
                            <label className="form-control-label">City</label>
                        </div>
                        <div className={"form-group float-label " + (this.state.addressForm.province?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="province" onChange={this.handleAddressFormChange} value={this.state.addressForm.province || ''}/>
                            <label className="form-control-label">State/Province</label>
                        </div>
                        <div className={"form-group float-label " + (this.state.addressForm.postalcode?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="postalcode" onChange={this.handleAddressFormChange} value={this.state.addressForm.postalcode || ''}/>
                            <label className="form-control-label">Postal Code</label>
                        </div>
                        <div className={"form-group float-label " + (this.state.addressForm.country?'active':'')}>
                            <input type="text" className={"form-control"} autoComplete="new-password" id="country" onChange={this.handleAddressFormChange} value={this.state.addressForm.country || ''}/>
                            <label className="form-control-label">Country</label>
							<button className="btn btn-block btn-default rounded" onClick={ e => this.addAddress(e) }>Add Address</button>
							<button className="btn btn-block btn-danger rounded" onClick={ e => this.hideAddAddress(e) } >Cancel</button>

                        </div>
                    </div>
                    

					<div className="card-header pb-0">
						<h6 className="mb-0">Your Addresses</h6>
						<div className="hr-thin"></div>
					</div>
					<ul className="list-group list-group-flush">
					
						<InfiniteScroll
							dataLength={addresslist.length}
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
					
						{addresslist.map((addressitem, index) => (
						
							<li key={index} className="list-group-item">
								<div>
								{addressitem.line1}<br />
								{addressitem.line2}<br />
								{addressitem.city} {addressitem.province} {addressitem.postalcode}<br />
								{addressitem.country}&nbsp;&nbsp;&nbsp;{addressitem.isprimary === true?(<span style={{color: 'green'}}>Primary</span>):(<span onClick={this.setPrimary(addressitem._id)}>Set Primary</span>)}
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

export default AppservicesAddress;