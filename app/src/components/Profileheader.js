// REACT
import React from 'react';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';

// STORE
import store from "../js/store/index";
import { updateStore } from "../js/actions/index";

// SERVICES
import userService from '../services/userService';


class Profileheader extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = store.getState();
		
		this.onDrop = this.onDrop.bind(this);
		this.onDropBG = this.onDropBG.bind(this);

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

			(
				async () => {

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

						toast.error('Authentication Session Has Expired');

					}

				}
			)();

		}

	};

    onDrop(pictureFiles, pictureDataURLs) {
    	if (pictureDataURLs.length === 0)
    	{
			toast.error('Image Upload Unsuccessful.');
    	}
    	else
    	{

			this.setState({uploadingPic: true});
						
			(async () => {

				let data = pictureDataURLs[0];

				let res = await userService.updateprofilepic(data);

				this.setState({uploadingPic: false});
				
				if (res.status === true)
				{

					store.dispatch( updateStore({ key: 'userImages', value: res.userimages }) );
					
					this.setState({showUploadPic: false});
					
					toast.success(res.message);

				}
				else
				{
					toast.error(res.message);
				}

			})();
    	
    	}
    	
    }

    onDropBG(pictureFiles, pictureDataURLs) {
    	if (pictureDataURLs.length === 0)
    	{
			toast.error('Image Upload Unsuccessful.');
    	}
    	else
    	{

			this.setState({uploadingBG: true});
			
			(async () => {

				let data = pictureDataURLs[0];

				let res = await userService.updateprofilebg(data);
				
				this.setState({uploadingBG: false});

				if (res.status === true)
				{

					store.dispatch( updateStore({ key: 'userImages', value: res.userimages }) );
					
					this.setState({showUploadBG: false});
					
					toast.success(res.message);

				}
				else
				{

					toast.error(res.message);
					
				}

			})();
			
    	}

    }
    
    setShowUploadPic(value) {        
        this.setState({showUploadPic: value});
    }

    setShowUploadBG(value) {        
        this.setState({showUploadBG: value});
    }
    
	render() {
	
		const isLoggedIn = this.state.isLoggedIn;
			
		if (isLoggedIn === true)
		{
			var backgroundImage = 'url(api/backgroundimage/)';

			var profileImage = 'url(api/profileimage/)';
						
			if (this.state.userImages && this.state.userImages.profilebg)
			{
				backgroundImage = 'url(' + this.state.userImages.profilebg + ')';
			}
			
			if (this.state.userImages && this.state.userImages.profilepic)
			{
				profileImage = 'url(' + this.state.userImages.profilepic + ')';
			}

			return (
				
				<>
				
				<div className="container-fluid px-0">
					<div className="card overflow-hidden" style={{background: 'transparent', maxWidth: '1140px', margin: 'auto'}}>
						<div className="card-body p-0 h-150">
							<div className="background text-center" style={((this.state.showUploadBG===true||this.state.uploadingBG===true)?{backgroundColor: 'rgba(255,255,255,0.35)'}:{backgroundImage: backgroundImage})} onMouseEnter={() => this.setShowUploadBG(true)} onMouseLeave={() => this.setShowUploadBG(false)}>
								<ImageUploader
									fileContainerStyle={{boxShadow: 'none', background: 'transparent', display: (this.state.showUploadBG===true&&this.state.uploadingBG!==true?'inline':'none')}}
									withIcon={false}
									withLabel={false}
									singleImage={true}
									buttonText={<span className="material-icons">cloud_upload</span>}
									buttonClassName={'btn btn-small'}
									onChange={this.onDropBG}
									errorStyle={{display: 'none'}}
								/>
								<i style={this.state.uploadingBG === true ? {
									color: '#fff',
									fontSize: '24px',
									marginTop: '20px'
								} : {display: 'none'}} className="fa fa-spinner fa-spin" aria-hidden="true"/>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid top-70 text-center mb-4">
					<div className="avatar avatar-140 rounded-circle mx-auto shadow">
						<div className="background" style={((this.state.showUploadPic===true||this.state.uploadingPic===true)?{backgroundColor: 'rgba(255,255,255,0.35)'}:{backgroundImage: profileImage})} onMouseEnter={() => this.setShowUploadPic(true)} onMouseLeave={() => this.setShowUploadPic(false)}>
							<ImageUploader
								fileContainerStyle={{boxShadow: 'none', background: 'transparent', display: (this.state.showUploadPic===true&&this.state.uploadingPic!==true?'inline':'none')}}
								withIcon={false}
								withLabel={false}
								singleImage={true}
								buttonText={<span className="material-icons">cloud_upload</span>}
								buttonClassName={'btn btn-small'}
								onChange={this.onDrop}
								errorStyle={{display: 'none'}}
							/>
							<i style={this.state.uploadingPic === true ? {
	color: '#fff',
	fontSize: '24px'
} : {display: 'none'}} className="fa fa-spinner fa-spin" aria-hidden="true"/>
						</div>
					</div>
				</div>

				<div className="container mb-4 text-center text-white">
					<h6 className="mb-1">{this.state.user?this.state.user.givenname:''} {this.state.user?this.state.user.familyname:''}</h6>
					<p>{this.state.user?this.state.user.residence_country:''}</p>
					<p className="mb-1"><strong>UserID:</strong> QM Z 00 0000 0000</p>
					<p className="mb-1">{this.state.user?this.state.user.email:''}</p>
					<p className="mb-1">{this.state.user?this.state.user.phone_number:''}</p>
					<p className="mb-1"><strong style={{textTransform: 'uppercase'}}>{this.state.user?this.state.user.pricingplan:''}</strong> Subscription</p>
					<ul class="nav nav-pills justify-content-center">
					<li class="nav-item"><a onClick={ e => this.setCurrentPage(e, 'pricingplan', 'Pricing Plan') } href="/" class="nav-link active"><div><span class="material-icons icon"></span>Change Subscription</div></a></li>
					</ul>
					<p>{this.state.user?this.state.user.phone_number:''}</p>
					
				</div>
				
				</>
			);

		}
		else
		{

			return (
				<div/>
			);

		}
	}
	
}

export default Profileheader;
