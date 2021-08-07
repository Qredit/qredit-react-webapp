import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import { CSSTransition } from 'react-transition-group';

// SERVICES
import userService from '../services/userService';


class AppservicesLanguage extends React.Component {

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
    
	setLanguage = (e, language) => {
	
		e.preventDefault();
		
		let cuser = this.state.user;
		cuser.preferred_language = language;
		store.dispatch( updateStore({ key: 'user', value: cuser }) );
		
		(async () => {

			let res = await userService.setlanguage(language);

			if (res.status === true)
			{
			
				toast.success('Language Setting Updated');
				store.dispatch( updateStore({ key: 'user', value: res.user }) );

			}
			else
			{
				toast.error(res.message);
			}

		})();
		
	};
	
	setShowItem = (show) => {
		
		this.setState({showitem: show});

	};
	
	
	render() {

		return (
			<CSSTransition in={this.state.appservicesItem === 'language'} timeout={500} classNames="transitionitem" onEnter={() => this.setShowItem(true)} onExited={() => this.setShowItem(false)}>

				<div className="card-body pt-0 px-0 mb-4" style={this.state.showitem===true?{}:{display:'none'}}>
					<ul className="list-group list-group-flush ml-4">
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'EN') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='EN'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch1">English</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'NL') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='NL'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch2">Dutch/Nederlands</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'ES') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='ES'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch2">Spanish/Español</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'PT') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='PT'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch3">Portuguese/Português</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'FR') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='FR'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch4">French/Français</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'DE') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='DE'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch5">German/Deutsch</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'ZH') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='ZH'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch5">Chinese/中文</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'KO') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='KO'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch5">Korean/한국어</label>
							</div>
						</li>
						<li className="list-group-item">
							<div className="custom-control custom-switch" onClick={ e => this.setLanguage(e, 'JA') } style={{cursor:'pointer'}}>
								<input type="radio" name="language" className="custom-control-input" readOnly checked={(this.state.user&&this.state.user.preferred_language==='JA'?'checked':'')}/>
								<label className="custom-control-label" htmlFor="customSwitch5">Japanese/日本語</label>
							</div>
						</li>
					</ul>
				</div>

			</CSSTransition>
		);


	}
	
}

export default AppservicesLanguage;