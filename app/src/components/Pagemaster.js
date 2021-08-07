import React from 'react';

import store from "../js/store/index";
  
class Pagemaster extends React.Component {

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
	
		const isLoggedIn = this.state.isLoggedIn;
		
		if (isLoggedIn === true)
		{

			return (
				<div>
									
					<main id='mainmain' className="flex-shrink-0 main has-footer">

						<header id="mainheader" className="header"></header>
						
						<div id="root"></div>

					</main>

					<div id="mainfooter" className="footer"></div>

				</div>
			);

		}
		else
		{

			return (
				<div>
					
					<main id='mainmain' className="flex-shrink-0 main has-footer">

						<header id="mainheader" className="header"></header>
						
						<div id="root"></div>

					</main>

					<div id="mainfooter" className="footer no-bg-shadow py-3"></div>
					
				</div>
			);

		}
	}
	
}

export default Pagemaster;
