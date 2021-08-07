import React from 'react';
import parse from "html-react-parser";

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

import { Modal, Button } from 'react-bootstrap';

class ShowModal extends React.Component {

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

	render() {
	
		const modalData = this.state.modalData;
		const modalButton = this.state.modalButton;
		const modalTitle = this.state.modalTitle;
		const modalCode = this.state.modalCode;

		var show = false;


		const closeModal = () => {

			store.dispatch( updateStore({ key: 'modalData', value: null }) );
			store.dispatch( updateStore({ key: 'modalCode', value: null }) );
			store.dispatch( updateStore({ key: 'modalButton', value: null }) );
			store.dispatch( updateStore({ key: 'modalTitle', value: null }) );

			store.dispatch( updateStore({ key: 'modalButtonClick', value: false }) );

		};

		const buttonModal = () => {

			store.dispatch( updateStore({ key: 'modalData', value: null }) );
			store.dispatch( updateStore({ key: 'modalCode', value: null }) );
			store.dispatch( updateStore({ key: 'modalButton', value: null }) );
			store.dispatch( updateStore({ key: 'modalTitle', value: null }) );

			store.dispatch( updateStore({ key: 'modalButtonClick', value: true }) );

		};


		if (modalData || modalCode)
		{

			show = true;

		}
		
		return (
		  <Modal centered show={show} onHide={ closeModal } backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
			  <Modal.Title>{modalTitle || ''}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{modalData!==null?parse(modalData || ''):modalCode}</Modal.Body>
			<Modal.Footer>
			  <Button variant="secondary" onClick={ closeModal }>
				Close
			  </Button>
			  <Button variant="primary" onClick={ buttonModal } style={(this.state.modalButton===null?{display:'none'}:{})}>
				{modalButton || ''}
			  </Button>
			</Modal.Footer>
		  </Modal>
		);		
		
	}
	
}

export default ShowModal;
