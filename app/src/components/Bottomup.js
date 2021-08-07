import React from 'react';
import parse from "html-react-parser";

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

//import { Modal, Button } from 'react-bootstrap';


class Bottomup extends React.Component {

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
    
	closeMe = (e) => {

		e.preventDefault();
		store.dispatch( updateStore({ key: 'bottomupactive', value: false }) );
    
	};

	bottombutton1Click = (e) => {

		e.preventDefault();
		store.dispatch( updateStore({ key: 'bottombutton1click', value: true }) );

console.log('button 1 click');

	};

	bottombutton2Click = (e) => {

		e.preventDefault();
		store.dispatch( updateStore({ key: 'bottombutton2click', value: true }) );
    
console.log('button 2 click');

    
	};
	
	bottombutton3Click = (e) => {

		e.preventDefault();
		store.dispatch( updateStore({ key: 'bottombutton3click', value: true }) );
    
console.log('button 3 click');

    
	};
	
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
		
		
		if (isLoggedIn === true)
		{

			return (
				<div className={"color-picker text-left " + (this.state.bottomupactive?'active':'')} style={{maxWidth: '768px', color: '#000'}}>
					<div className="row" style={{height: '30px'}}>
						<div className="col text-left">
							<h5 style={{marginBottom:'0px', paddingBottom: '0px'}}>{this.state.bottomUpHeader || ''}</h5>
						</div>
						<div className="col-auto">
							<button style={{marginTop: '-10px'}} onClick={ e => this.closeMe(e) } className="btn btn-link text-secondary btn-round colorsettings2"><span
									className="material-icons">close</span></button>
						</div>
					</div>
			
					<hr className="mt-2" />
					
					{parse(this.state.bottomUpInfo || '',{
					  replace: ({ attribs }) => {
						if (attribs && attribs.id === 'bottombutton1') {
						  return <button className="btn btn-success" onClick={ e => this.bottombutton1Click(e) }>{this.state.bottombutton1text}</button>;
						}

						if (attribs && attribs.id === 'bottombutton2') {
						  return <button className="btn btn-success" onClick={ e => this.bottombutton2Click(e) }>{this.state.bottombutton2text}</button>;
						}

						if (attribs && attribs.id === 'bottombutton3') {
						  return <button className="btn btn-success" onClick={ e => this.bottombutton3Click(e) }>{this.state.bottombutton3text}</button>;
						}
					  }
					})}

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

export default Bottomup;
