import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

// SERVICES
import userService from '../services/userService';


class Login extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.state.loginForm = {};

	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
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

	handleLoginFormChange = event => {

		if (event.target.type === 'checkbox')
		{
			event.target.value = event.target.checked;
		}

		var currentLoginForm = this.state.loginForm;
		
		currentLoginForm[event.target.id] = event.target.value;

		this.setState({loginForm:currentLoginForm});

	};

	doLogin = (e) => {

		if (this.state.loginForm.login_password === '' 
			|| this.state.loginForm.login_email === ''
			|| !this.state.loginForm.login_password
			|| !this.state.loginForm.login_email)
		{
			toast.error('Missing credentials');
		}
		else
		{
		
			store.dispatch( updateStore({ key: 'loggingIn', value: true }) );

			(async () => {

				let data = {
					email: this.state.loginForm.login_email,
					password: this.state.loginForm.login_password,
					tfapin: this.state.loginForm.login_tfapin
				};

				let res = await userService.login(data);

				store.dispatch( updateStore({ key: 'loggingIn', value: false }) );
				
				if (res.status === true)
				{

					if (res.accessToken) {
						localStorage.setItem("accessToken", res.accessToken);
					}
				
					store.dispatch( updateStore({ key: 'loginForm', value: {} }) );
					store.dispatch( updateStore({ key: 'isLoggedIn', value: true }) );
					store.dispatch( updateStore({ key: 'accessToken', value: res.accessToken }) );
					store.dispatch( updateStore({ key: 'requestedPage', value: 'homepage' }) );
					store.dispatch( updateStore({ key: 'requestedPageTitle', value: 'Home' }) );

					store.dispatch( updateStore({ key: 'user', value: res.user }) );

					toast.success(res.message);
					
					let resi = await userService.getimages();

					if (resi.status === true)
					{
						store.dispatch( updateStore({ key: 'userImages', value: resi.userimages }) );
					}
					
				}
				else
				{
					toast.error(res.message);
				}

			})();

		}

	};
	
	onKeyDownLogin = event => {

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.doLogin(event);
      }
      
	};
	
	render() {

		return (
			<>
				<div className="container h-100 text-white">
					<div className="row h-100">
						<div className="col-12 align-self-center mb-4">
							<div className="row justify-content-center">
								<div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">
								<div className="row no-gutters text-center justify-content-center mb-4">
								<li className="navbar-brand">
								<img alt='' className="center" src="/img/qredit-wide2.png" style={{height: '30px', textAlign: 'center'}} />
								</li>
						       </div>
									<h2 className="font-weight-normal mb-5">Login</h2>
									
									<div className={"form-group float-label position-relative " + (this.state.loginForm.login_email?'active':'')}>
										<input required type="text" id="login_email" className="form-control text-white" onKeyDown={this.onKeyDownLogin} onChange={this.handleLoginFormChange} autoComplete="new-password" value={this.state.loginForm.login_email || ''} />
										<label className="form-control-label text-white">Email</label>
									</div>
									<div className={"form-group float-label position-relative " + (this.state.loginForm.login_password?'active':'')}>
										<input required type="password" id='login_password' className="form-control text-white" onKeyDown={this.onKeyDownLogin} onChange={this.handleLoginFormChange} autoComplete="new-password" value={this.state.loginForm.login_password || ''} />
										<label className="form-control-label text-white">Password</label>
									</div>
									<div className={"form-group float-label position-relative " + (this.state.loginForm.login_tfapin?'active':'')}>
										<input required type="text" id="login_tfapin" className="form-control text-white" onKeyDown={this.onKeyDownLogin} onChange={this.handleLoginFormChange} autoComplete="new-password" value={this.state.loginForm.login_tfapin || ''} />
										<label className="form-control-label text-white">2FA Pin (if active)</label>
									</div>
									<p className="text-right">
										<li onClick={ e => this.setCurrentPage(e, 'loginhelp', 'Login Help') } className="text-white lilink">Forgot Password?</li>
									</p>
									<div id="spinoverlay" style={this.state.loggingIn===true?{}:{display:'none'}}>
										<div className="spinloader"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<ul className="nav nav-pills justify-content-center mb-4">
						<li className="nav-item" onClick={ e => this.doLogin(e) } href="/" className="nav-link active">
							<div>
								<span className="material-icons icon" />Login
							</div>
						</li>
					</ul>
				</div>
		
			</>
		);

	}
	
}

export default Login;
