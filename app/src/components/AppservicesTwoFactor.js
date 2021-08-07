import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

// SERVICES
import userService from '../services/userService';


class AppservicesTwoFactor extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.tfaForm = {};

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
			
			(async () => {
	
				let res = await userService.usertwofactor();

				if (res.status === true)
				{
				
					var currentTfaForm = this.state.tfaForm;
		
					currentTfaForm['twofactorstatus'] = res.twofactorstatus;
					currentTfaForm['qrcodedataurl'] = res.qrcodedataurl;
					
					this.setState({tfaForm:currentTfaForm});
				
				}
				else
				{
					toast.error(res.message);
				}

			})();
			
		}); 
	}
	
    componentWillUnmount(){
        this.unsubscribe();     
    }
    
	activateTwoFactor = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let data = {pincode: this.state.tfaForm.tfapin, password: this.state.tfaForm.password};

			let res = await userService.usertwofactorsave(data);
			
			if (res.status === true)
			{
		
				toast.success(res.message);

				var currentTfaForm = this.state.tfaForm;
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['qrcodedataurl'] = null;
				currentTfaForm['tfapin'] = '';
				
				this.setState({tfaForm:currentTfaForm});
					
			}
			else
			{
				toast.error(res.message);
				
				var currentTfaForm = this.state.tfaForm;
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['tfapin'] = '';
				
				this.setState({tfaForm:currentTfaForm});
				
			}

		})();
		
	};

	deactivateTwoFactor = (e) => {
	
		e.preventDefault();
		
		(async () => {

			let data = {pincode: this.state.tfaForm.tfapin};

			let res = await userService.usertwofactordisable(data);
			
			if (res.status === true)
			{
		
				toast.success(res.message);

				var currentTfaForm = this.state.tfaForm;
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['qrcodedataurl'] = res.qrcodedataurl;
				currentTfaForm['tfapin'] = '';
				
				this.setState({tfaForm:currentTfaForm});
					
			}
			else
			{
				toast.error(res.message);
				
				var currentTfaForm = this.state.tfaForm;
	
				currentTfaForm['twofactorstatus'] = res.twofactorstatus;
				currentTfaForm['tfapin'] = '';
				
				this.setState({tfaForm:currentTfaForm});
				
			}

		})();
		
	};
	
	handleTfaFormChange = event => {
	
		var currentTfaForm = this.state.tfaForm;
		
		currentTfaForm[event.target.id] = event.target.value;

		this.setState({tfaForm:currentTfaForm});
		
	};
	
	setShowItem = (show) => {
		
		this.setState({showitem: show});

	};
	
	
	render() {

		return (
			<CSSTransition in={this.state.appservicesItem === 'twofactor'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
                    <div className="card-header">
                        <h6 className="subtitle mb-0">
                            Two Factor Authentication is {this.state.tfaForm.twofactorstatus===true?'Active':'Inactive'}
                        </h6>
                    </div>
                    <div className="card-body">
						
						{(this.state.tfaForm.qrcodedataurl)?(
							<div>
							<div>
							<img style={{width: '150px', height: '150px'}} src={this.state.tfaForm.qrcodedataurl} />
							<br />
							Scan barcode with your authenticator app and enter the displayed PIN code to activate.
							</div>

							<div className="form-group float-label">
								<input type="password" className={"form-control " + (this.state.tfaForm.password?'active':'')} autoComplete="off" id="password" onChange={this.handleTfaFormChange} value={this.state.tfaForm.password || ''}/>
								<label className="form-control-label">Password</label>
							</div>
                        	</div>
						):(<div>Enter your authenticator PIN Code to disable Two Factor</div>)}
						
                        <div className="form-group float-label">
                            <input type="text" className={"form-control " + (this.state.tfaForm.tfapin?'active':'')} autoComplete="off" id="tfapin" onChange={this.handleTfaFormChange} value={this.state.tfaForm.tfapin || ''}/>
                            <label className="form-control-label">Two Factor Pin</label>
                        </div>
						
                    </div>
                    <div className="card-footer">

						{this.state.tfaForm.twofactorstatus===false?(
						
                        	<button className="btn btn-block btn-default rounded" onClick={ e => this.activateTwoFactor(e) }>Activate</button>

						):(
						
							<button className="btn btn-block btn-danger rounded mt-3" onClick={ e => this.deactivateTwoFactor(e) }>Deactivate</button>
                    		
                    	)}
                    		
                    </div>


				</div>
				
			</CSSTransition>
		);


	}
	
}

export default AppservicesTwoFactor;