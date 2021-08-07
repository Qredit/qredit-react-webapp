import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import countryList from 'react-select-country-list'


// SERVICES
import userService from '../services/userService';

const countrylist = countryList().getData();

class Register extends React.Component {

	constructor(props) {

		super(props);

		this.state = store.getState();

		this.state.registerForm = {};
		this.state.registerFormFeedback = {};

	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {
			this.setState(store.getState());
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	setCurrentPage = (e, page, pagetitle = '') => {
		e.preventDefault();
		store.dispatch(updateStore({ key: 'requestedPage', value: page }));
		store.dispatch(updateStore({ key: 'pageTitle', value: pagetitle }));

		if (this.state.isLoggedIn === true) {

			(async () => {

				let res = await userService.get();

				if (res.status === true) {
					store.dispatch(updateStore({ key: 'user', value: res.user }));
				}
				else {

					store.dispatch(updateStore({ key: 'isLoggedIn', value: false }));
					store.dispatch(updateStore({ key: 'accessToken', value: null }));
					store.dispatch(updateStore({ key: 'requestedPage', value: 'login' }));
					store.dispatch(updateStore({ key: 'pageTitle', value: 'Login' }));

					toast.error('Authentication Session Has Expired');

				}

			})();

		}

	};

	handleRegisterFormChange = event => {

		if (event.target.type === 'checkbox') {
			event.target.value = event.target.checked;
		}

		var currentRegisterForm = this.state.registerForm;

		currentRegisterForm[event.target.id] = event.target.value;

		this.setState({ registerForm: currentRegisterForm });


		var currentRegisterFormFeedback = this.state.registerFormFeedback;

		let feedbackname = event.target.id.replace('register_', '') + 'invalid';

		currentRegisterFormFeedback[feedbackname] = null;

		this.setState({ registerFormFeedback: currentRegisterFormFeedback });

	};



	doRegister = (e) => {

		e.preventDefault();

		this.setState({ registerFormFeedback: {} });

		let feedbacks = {};

		let haserrors = false;

		if (this.state.registerForm.register_password !== this.state.registerForm.register_passwordconfirm) {
			feedbacks['passwordconfirminvalid'] = 'Passwords do not match';
			haserrors = true;
		}

		if (this.state.registerForm.register_password === '' || !this.state.registerForm.register_password) {
			feedbacks['passwordinvalid'] = 'Missing password';
			haserrors = true;
		}

		if (this.state.registerForm.register_email === '' || !this.state.registerForm.register_email) {
			feedbacks['emailinvalid'] = 'Missing email';
			haserrors = true;
		}

		if (this.state.registerForm.register_familyname === '' || !this.state.registerForm.register_familyname) {
			feedbacks['familynameinvalid'] = 'Missing family name';
			haserrors = true;
		}

		if (this.state.registerForm.register_givenname === '' || !this.state.registerForm.register_givenname) {
			feedbacks['givennameinvalid'] = 'Missing given name';
			haserrors = true;
		}

		if (this.state.registerForm.register_country === '' || !this.state.registerForm.register_country) {
			feedbacks['countryinvalid'] = 'Missing country';
			haserrors = true;
		}

		if (this.state.registerForm.register_entity === '' || !this.state.registerForm.register_entity) {
			feedbacks['entityinvalid'] = 'Missing entity';
			haserrors = true;
		}

		if (this.state.registerForm.register_entity === 'corporation') {

			if (this.state.registerForm.register_companyname === '' || !this.state.registerForm.register_companyname) {
				feedbacks['companynameinvalid'] = 'Missing company name';
				haserrors = true;
			}

		}

		if (!this.state.registerForm.register_terms || this.state.registerForm.register_terms === "false") {
			feedbacks['termsinvalid'] = 'You must agree to the terms';
			haserrors = true;
		}

		if (haserrors === true) {
			this.setState({ registerFormFeedback: feedbacks });
			toast.error('Error in your inputs, check for errors below');
		}

		if (haserrors === false) {

			(async () => {

				let invitecode = localStorage.getItem("invitecode");

				let data = {
					entity: this.state.registerForm.register_entity,
					email: this.state.registerForm.register_email,
					companyname: this.state.registerForm.register_companyname,
					familyname: this.state.registerForm.register_familyname,
					givenname: this.state.registerForm.register_givenname,
					residence_country: this.state.registerForm.register_country,
					password: this.state.registerForm.register_password,
					invitecode: invitecode
				};

				let res = await userService.register(data);

				if (res.status === true) {
					store.dispatch(updateStore({ key: 'registerForm', value: {} }));
					store.dispatch(updateStore({ key: 'requestedPage', value: 'login' }));

					toast.success(res.message);
				}
				else {

					toast.error(res.message);

					if (res.errorfield === 'email') {
						this.setState({ registerFormFeedback: { emailinvalid: res.message } });

					}
					else if (res.errorfield === 'password') {
						this.setState({ registerFormFeedback: { passwordinvalid: res.message } });
					}

				}

			})();

		}

	};

	render() {

		let countriesList = countrylist.length > 0
			&& countrylist.map((item, i) => {
				return (
					<option key={i} value={item.value}>{item.label}</option>
				)
			}, this);

		return (
			<>
				<div className="container h-100 text-white">
					<div className="row h-100">
						<div className="col-12 align-self-center mb-4">
							<div className="row justify-content-center">
								<div className="col-11 col-sm-7 col-md-6 col-lg-5 col-xl-4">

									<div className="row no-gutters text-center justify-content-center mb-4">
										<li className="navbar-brand">
											<img alt='' className="center" src="/img/qredit-wide2.png" style={{ height: '30px', textAlign: 'center' }} />
										</li>
									</div>

									<h2 className="font-weight-normal mb-5">Register New Account</h2>
									<form className="was-validated">

										<div className={"form-group float-label position-relative " + (this.state.registerForm.register_entity ? 'active' : '')}>

											<select defaultValue={this.state.registerForm.register_entity} required id="register_entity" className="form-control text-white" onChange={this.handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
												<option value=''></option>
												<option value='individual'>Personal</option>
												<option value='corporation'>Business</option>
											</select>

											<label className="form-control-label text-white">Account Type</label>
											<div id="register_entity_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.entityinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.entityinvalid || ''}</div>
										</div>

										<div className={"form-group float-label position-relative " + (this.state.registerForm.register_email ? 'active' : '')}>
											<input required id="register_email" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_email || ''} />
											<label className="form-control-label text-white">Email</label>
											<div id="register_email_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.emailinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.emailinvalid || ''}</div>
										</div>

										{this.state.registerForm.register_entity !== 'corporation' ? (
											<>
												<div className={"form-group float-label position-relative " + (this.state.registerForm.register_givenname ? 'active' : '')}>
													<input required id="register_givenname" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_givenname || ''} />
													<label className="form-control-label text-white">First (Given) Name</label>
													<div id="register_givenname_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.givennameinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.givennameinvalid || ''}</div>
												</div>
												<div className={"form-group float-label position-relative " + (this.state.registerForm.register_familyname ? 'active' : '')}>
													<input required id="register_familyname" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_familyname || ''} />
													<label className="form-control-label text-white">Last (Family) Name</label>
													<div id="register_familyname_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.familynameinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.familynameinvalid || ''}</div>
												</div>
											</>
										) : (
												<>
													<div className={"form-group float-label position-relative " + (this.state.registerForm.register_companyname ? 'active' : '')}>
														<input required id="register_companyname" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_companyname || ''} />
														<label className="form-control-label text-white">Company Name</label>
														<div id="register_companyname_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.companynameinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.companynameinvalid || ''}</div>
													</div>
													<div className={"form-group float-label position-relative " + (this.state.registerForm.register_givenname ? 'active' : '')}>
														<input required id="register_givenname" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_givenname || ''} />
														<label className="form-control-label text-white">Contact First (Given) Name</label>
														<div id="register_givenname_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.givennameinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.givennameinvalid || ''}</div>
													</div>
													<div className={"form-group float-label position-relative " + (this.state.registerForm.register_familyname ? 'active' : '')}>
														<input required id="register_familyname" type="text" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_familyname || ''} />
														<label className="form-control-label text-white">Contact Last (Family) Name</label>
														<div id="register_familyname_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.familynameinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.familynameinvalid || ''}</div>
													</div>
												</>
											)}
										<div className={"form-group float-label position-relative " + (this.state.registerForm.register_country ? 'active' : '')}>

											<select defaultValue={this.state.registerForm.register_country} required id="register_country" className="form-control text-white" onChange={this.handleRegisterFormChange} style={{ backgroundColor: 'transparent' }}>
												<option value=''></option>
												{countriesList}
											</select>

											<label className="form-control-label text-white">Country of Residence</label>
											<div id="register_country_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.countryinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.countryinvalid || ''}</div>
										</div>
										<div className={"form-group float-label position-relative " + (this.state.registerForm.register_password ? 'active' : '')}>
											<input required id="register_password" type="password" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_password || ''} />
											<label className="form-control-label text-white">Password</label>
											<div id="register_password_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.passwordinvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.passwordinvalid || ''}</div>
										</div>
										<div className={"form-group float-label position-relative " + (this.state.registerForm.register_passwordconfirm ? 'active' : '')}>
											<input required id="register_passwordconfirm" type="password" className="form-control text-white" onChange={this.handleRegisterFormChange} autoComplete="new-password" value={this.state.registerForm.register_passwordconfirm || ''} />
											<label className="form-control-label text-white">Confirm Password</label>
											<div id="register_passwordconfirm_feedback" className="invalid-feedback" style={!this.state.registerFormFeedback.passwordconfirminvalid ? {} : { marginBottom: '-18px' }}>{this.state.registerFormFeedback.passwordconfirminvalid || ''}</div>
										</div>
										<div className="form-group float-label position-relative">
											<div className="custom-control custom-switch">
												<input checked={this.state.registerForm.register_terms === "true"} required id="register_terms" type="checkbox" className="custom-control-input" onChange={this.handleRegisterFormChange} />
												<label className="custom-control-label" htmlFor="register_terms">Agree to terms and conditions</label>
												<div id="register_terms_feedback" className="invalid-feedback" >{this.state.registerFormFeedback.termsinvalid || ''}</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>

					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-6">
						<li onClick={e => this.doRegister(e)} className="btn btn-default rounded btn-block lilink">Sign up</li>
					</div>
				</div>
			</>
		);

	}

}

export default Register;
