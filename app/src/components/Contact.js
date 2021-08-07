import React from 'react';

import store from "../js/store/index";
import { updateStore } from "../js/actions/index";
import { toast } from 'react-toastify';

import InfiniteScroll from "react-infinite-scroll-component";

// SERVICES
import userService from '../services/userService';

import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import QRCode from "react-qr-code";


class Contacts extends React.Component {

    constructor(props) {

        super(props);

        this.state = store.getState();

        this.state.foundContact = [];

    }

    componentDidMount() {

        this.unsubscribe = store.subscribe(() => {

            this.setState(store.getState());

        })

        store.dispatch(updateStore({ key: 'contactsItem', value: null }));

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

    refresh = () => {

        (async () => {

            this.setState({ isFetching: true, shownItems: 20 });

            let res = await userService.getcontacts(0, 20);

            if (res.status === true) {
                this.setState({ 'contactlist': res.contactlist });
                this.setState({ 'hasMore': res.hasmore });
            }

            this.setState({ isFetching: false });

        })();
    };

    prefresh = () => {

        (async () => {

            this.setState({ pisFetching: true, pshownItems: 20 });

            let res = await userService.getpendingcontacts(0, 20);

            if (res.status === true) {
                this.setState({ 'pendingcontactlist': res.contactlist });
                this.setState({ 'phasMore': res.hasmore });
            }

            this.setState({ pisFetching: false });

        })();
    };

    fetchMoreData = () => {

        (async () => {

            var currentCount = this.state.shownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            this.setState({ shownItems: newCount });

            let res = await userService.getcontacts(skip, limit);

            if (res.status === true) {

                let newcontactlist = this.state.contactlist.concat(res.contactlist);

                this.setState({ 'contactlist': newcontactlist });
                this.setState({ 'hasMore': res.hasmore });
            }

        })();
    };

    pfetchMoreData = () => {

        (async () => {

            var currentCount = this.state.pshownItems;
            var newCount = currentCount + 20;
            var skip = newCount - 20;
            var limit = 20;

            this.setState({ pshownItems: newCount });

            let res = await userService.getpendingcontacts(skip, limit);

            if (res.status === true) {

                let newpcontactlist = this.state.pendingcontactlist.concat(res.contactlist);

                this.setState({ 'pendingcontactlist': newpcontactlist });
                this.setState({ 'phasMore': res.hasmore });
            }

        })();
    };

    scanQR = (e) => {

        e.preventDefault();

        this.setState({ modalType: 'scancontactqr' });

        this.setState({ scanProcessing: false });

        let modalData = (
            <BarcodeScannerComponent
                width={'100%'}
                height={400}
                onUpdate={(err, result) => {
                    if (result) {

                        if (this.state.scanProcessing === false) {

                            this.setState({ scanProcessing: true });

                            (async () => {

                                let res = await userService.newcontact(result.text);

                                if (res.status === true) {

                                    toast.success(res.message);
                                    this.prefresh();

                                }
                                else {

                                    toast.error(res.message);

                                }

                                this.setState({ scanProcessing: false });

                                store.dispatch(updateStore({ key: 'modalCode', value: null }));
                                store.dispatch(updateStore({ key: 'modalData', value: null }));
                                store.dispatch(updateStore({ key: 'modalButton', value: null }));
                                store.dispatch(updateStore({ key: 'modalTitle', value: null }));
                                store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

                            })();

                        }

                    }
                }}
            />
        );

        store.dispatch(updateStore({ key: 'modalCode', value: modalData }));
        store.dispatch(updateStore({ key: 'modalData', value: null }));
        store.dispatch(updateStore({ key: 'modalButton', value: null }));
        store.dispatch(updateStore({ key: 'modalTitle', value: 'Scan QR Contact' }));
        store.dispatch(updateStore({ key: 'modalButtonClick', value: false }));

    };

    toggleFinder = (e) => {

        e.preventDefault();

        if (this.state.showFinder === true) {

            this.setState({ 'showFinder': false });

        }
        else {

            this.setState({ 'showFinder': true });

        }

    };

    handleInviteFormChange = event => {

        this.setState({ inviteContact: event.target.value });

    };

    inviteContact = (e) => {

        e.preventDefault();

        (async () => {

            let res = await userService.createinvitation(this.state.inviteContact);

            if (res.status === true) {
                toast.success(res.message);
            }
            else {
                toast.error(res.message);
            }

        })();

    }

    handleEmailFormChange = event => {

        this.setState({ searchEmail: event.target.value });

    };

    findContact = (e) => {

        e.preventDefault();

        (async () => {

            var searchEmail = this.state.searchEmail;

            let res = await userService.findcontact(searchEmail);

            if (res.status === true) {

                this.setState({ foundContact: [res.foundcontact] });

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    addContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.newcontact(id);

            if (res.status === true) {

                toast.success(res.message);
                this.setState({ foundContact: [] });
                this.prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    approveContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.approvecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                this.prefresh();
                this.refresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    declineContact = (e, id) => {

        e.preventDefault();

        (async () => {

            let res = await userService.declinecontact(id);

            if (res.status === true) {

                toast.success(res.message);
                this.prefresh();

            }
            else {

                toast.error(res.message);

            }

        })();

    }

    viewContact = (e, id) => {

        e.preventDefault();

        store.dispatch(updateStore({ key: 'requestedPage', value: 'viewcontact' }));
        store.dispatch(updateStore({ key: 'pageTitle', value: 'View Contact' }));
        store.dispatch(updateStore({ key: 'requestedPageExtra', value: id }));

    }

    setCurrentItem = (e, item) => {

        e.preventDefault();

        if (this.state.contactsItem === item) {
            store.dispatch(updateStore({ key: 'contactsItem', value: null }));
        }
        else {
            store.dispatch(updateStore({ key: 'contactsItem', value: item }));


            if (item === 'viewpending') {

                this.prefresh();

            }

            if (item === 'viewcontacts') {

                this.refresh();

            }

        }

    };

    render() {

        const isLoggedIn = this.state.isLoggedIn;

        const contactlist = this.state.contactlist || [];
        const pendingcontactlist = this.state.pendingcontactlist || [];

        if (isLoggedIn === true) {

            const userid = this.state.user._id || '';

            return (
                <div className="card mt-2">
                    <div className="card-header">
                        <h6 className="mb-0">Contact Menu</h6>
                    </div>
                    <div className="card-body px-0 pt-0">
                        <div className="hr-thin"></div>
                        <div className="list-group list-group-flush border-color">
                            <a onClick={e => this.setCurrentItem(e, 'viewcontacts')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/006-user.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">View Contacts</h6><p className="text-secondary">View current contacts</p>
                                    </div>
                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(this.state.contactsItem === 'viewcontacts' ? {} : { display: 'none' })}>

                                <div className="input-group pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Search Contacts" />
                                    <div className="input-group-append">
                                        <button className="btn btn-default rounded" type="button" id="button-addon2">Search</button>
                                    </div>
                                </div>

                                <ul className="list-group list-group-flush">

                                    <InfiniteScroll
                                        dataLength={contactlist.length}
                                        next={this.fetchMoreData}
                                        hasMore={this.state.hasMore || false}
                                        loader={
                                            <p style={{ textAlign: "center" }}>
                                                <b>Loading...</b>
                                            </p>
                                        }
                                        height={400}
                                        endMessage={
                                            this.state.isFetching === true ? (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>Loading...</b>
                                                </p>
                                            ) : (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>No More Records</b>
                                                </p>
                                            )
                                        }
                                    >
                                        {contactlist.map((contactitem, index) => (

                                            <li key={index} className="list-group-item" onClick={e => this.viewContact(e, contactitem._id)} style={{ cursor: 'pointer' }}>
                                                <div className="row align-items-center">
                                                    <div className="col-auto pr-0">
                                                        <div className="avatar avatar-40 rounded">
                                                            <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (userid === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col align-self-center pr-0">
                                                        <h6 className="font-weight-normal mb-1">{(userid === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(userid === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                        <p className="small text-secondary">{(userid === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                                    </div>
                                                    <div className="col-auto">
                                                        <div className="avatar avatar-40 text-default">
                                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/045-eye.svg")' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </InfiniteScroll>
                                </ul>
                            </div>

                            <a onClick={e => this.setCurrentItem(e, 'viewqr')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/085-link.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Your Contact QR</h6><p className="text-secondary">Show your contact QR</p>
                                    </div>
                                </div>
                            </a>
                            <div className="row align-items-center" style={(this.state.contactsItem === 'viewqr' ? {} : { display: 'none' })}>
                                <div className="hr-thin mb-2"></div>
                                <div className="col-auto" style={{ margin: 'auto' }}><QRCode value={userid} /></div>
                                <div className="hr-thin mt-2"></div>
                            </div>

                            <a onClick={e => this.scanQR(e)} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/097-qr code scan.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Scan New Contact QR</h6><p className="text-secondary">Add your contact by their QR</p>
                                    </div>
                                </div>
                            </a>
                            <a onClick={e => this.setCurrentItem(e, 'findcontact')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/031-search.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Search Contacts</h6><p className="text-secondary">Find by phone or email</p>
                                    </div>

                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(this.state.contactsItem === 'findcontact' ? {} : { display: 'none' })}>
                                <div className="hr-thin mt-2 mb-2"></div>
                                <div className="input-group col-auto pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Email/Phone" onChange={this.handleEmailFormChange} />
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default input-group-append">
                                            <figure className="m-0 background icon icon-30 mb-2" type="button" id="button-addon2" onClick={e => this.findContact(e)} style={{ backgroundImage: 'url("/img/icons/essential/svg/031-search.svg")' }} />
                                        </div>
                                    </div>
                                </div>

                                <ul className="list-group list-group-flush">

                                    {this.state.foundContact.map((contactitem, index) => (

                                        <li key={index} className="list-group-item">
                                            <div className="row align-items-center">
                                                <div className="col-auto pr-0">
                                                    <div className="avatar avatar-40 rounded">
                                                        <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + contactitem._id + ')' }}>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col align-self-center pr-0">
                                                    <h6 className="font-weight-normal mb-1">{contactitem.givenname} {contactitem.familyname}</h6>
                                                    <p className="small text-secondary">{contactitem.email}</p>
                                                </div>
                                                <div className="col-auto">
                                                    <figure onClick={e => this.addContact(e, contactitem._id)} className="m-0 background icon icon-30 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/009-plus.svg")' }} />
                                                </div>
                                            </div>
                                        </li>

                                    ))}
                                </ul>
                                <div className="hr-thin mt-2 mb-2"></div>
                            </div>
                            <a onClick={e => this.setCurrentItem(e, 'invitecontact')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/019-chat.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Invite</h6><p className="text-secondary">Invite new contacts</p>
                                    </div>
                                </div>
                            </a>
                            <div className="card-body px-0 pt-0" style={(this.state.contactsItem === 'invitecontact' ? {} : { display: 'none' })}>
                                <div className="hr-thin mt-2 mb-2"></div>
                                <div className="input-group col-auto pl-1 pr-1">
                                    <input type="text" className="form-control" placeholder="Email/Phone" onChange={this.handleInviteFormChange} />
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default input-group-append">
                                            <figure className="m-0 background icon icon-30 mb-2" type="button" id="button-addon2" onClick={e => this.inviteContact(e)} style={{ backgroundImage: 'url("/img/icons/essential/svg/030-send.svg")' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="hr-thin mt-2 mb-2"></div>
                            </div>
                            <a onClick={e => this.setCurrentPage(e, 'referrals', 'Referral Program')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/073-gift.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">Referral Program</h6><p className="text-secondary">Referral program</p>
                                    </div>
                                </div>
                            </a>
                            <a onClick={e => this.setCurrentItem(e, 'viewpending')} href="/" className="list-group-item list-group-item-action border-color">
                                <div className="row">
                                    <div className="col-auto button">
                                        <div className="avatar avatar-40 text-default">
                                            <figure className="m-0 background icon icon-24 mb-2" style={{ backgroundImage: 'url("/img/icons/essential/svg/071-open mail.svg")' }} />
                                        </div>
                                    </div>
                                    <div className="col align-self-center pl-0"><h6 className="mb-1">View Pending Requests</h6><p className="text-secondary">View pending contacts</p>
                                    </div>
                                </div>
                            </a>


                            <div className="card-body px-0 pt-0" style={(this.state.contactsItem === 'viewpending' ? {} : { display: 'none' })}>

                                <ul className="list-group list-group-flush">

                                    <InfiniteScroll
                                        dataLength={pendingcontactlist.length}
                                        next={this.pfetchMoreData}
                                        hasMore={this.state.phasMore || false}
                                        loader={
                                            <p style={{ textAlign: "center" }}>
                                                <b>Loading...</b>
                                            </p>
                                        }
                                        height={200}
                                        endMessage={
                                            this.state.pisFetching === true ? (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>Loading...</b>
                                                </p>
                                            ) : (
                                                <p style={{ textAlign: "center" }}>
                                                    <b>No More Records</b>
                                                </p>
                                            )
                                        }
                                    >
                                        <div className="hr-thin"></div>
                                        {pendingcontactlist.map((contactitem, index) => (

                                            <li key={index} className="list-group-item">
                                                <div className="row align-items-center">
                                                    <div className="col-auto pr-0">
                                                        <div className="avatar avatar-40 rounded">
                                                            <div className="background" style={{ backgroundImage: 'url(api/profileimage/' + (userid === contactitem.userid_b._id ? contactitem.userid_a._id : contactitem.userid_b._id) + ')' }}>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col align-self-center pr-0">
                                                        <h6 className="font-weight-normal mb-1">{(userid === contactitem.userid_b._id ? contactitem.userid_a.givenname : contactitem.userid_b.givenname)} {(userid === contactitem.userid_b._id ? contactitem.userid_a.familyname : contactitem.userid_b.familyname)}</h6>
                                                        <p className="small text-secondary">{(userid === contactitem.userid_b._id ? contactitem.userid_a.email : contactitem.userid_b.email)}</p>
                                                    </div>
                                                    <div className="col-auto mt-2 mb-2">
                                                        {(userid === contactitem.userid_b._id ? <><button onClick={e => this.approveContact(e, contactitem._id)} className="btn btn-sm btn-success rounded mr-1" type="button" id="button-addon2">Approve</button><button onClick={e => this.declineContact(e, contactitem._id)} className="btn btn-sm btn-danger rounded" type="button" id="button-addon2">Decline</button></> : 'Pending')}
                                                    </div>
                                                    <div className="hr-thin"></div>
                                                </div>
                                            </li>

                                        ))}
                                    </InfiniteScroll>
                                </ul>
                            </div>



                        </div>
                    </div>
                </div>
            );

        }
        else {

            return (
                <div />
            );

        }
    }

}

export default Contacts;
