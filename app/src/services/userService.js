
import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        const token = 'Bearer ' + accessToken;
        config.headers.Authorization = token;
        config.headers['x-access-token'] = accessToken;
    }

    return config;
});

var userService = {

    get: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/user`, data);
        return res.data || [];
    },

    gettottoken: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/usertottoken`, data);
        return res.data || [];
    },

    savepersonasettings: async (settings) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            settings: settings
        };
        let res = await axios.post(`/api/usersavepersonasettings`, data);
        return res.data || [];
    },

    invalidatesessions: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/userinvalidatesessions`, data);
        return res.data || [];
    },

    logout: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/userlogout`, data);
        return res.data || [];
    },

    getimages: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/userimages`, data);
        return res.data || [];
    },

    getloginhistory: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetloginhistory`, data);
        return res.data || [];
    },

    getcontacts: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetcontacts`, data);
        return res.data || [];
    },

    getcontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid
        };
        let res = await axios.post(`/api/usergetcontact`, data);
        return res.data || [];
    },

    getpendingcontacts: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetpendingcontacts`, data);
        return res.data || [];
    },

    findcontact: async (email) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: email,
        };
        let res = await axios.post(`/api/userfindcontact`, data);
        return res.data || [];
    },

    newcontact: async (otheruserid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            otheruserid: otheruserid,
        };
        let res = await axios.post(`/api/usernewcontact`, data);
        return res.data || [];
    },

    approvecontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid,
        };
        let res = await axios.post(`/api/userapprovecontact`, data);
        return res.data || [];
    },

    declinecontact: async (contactid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            contactid: contactid,
        };
        let res = await axios.post(`/api/userdeclinecontact`, data);
        return res.data || [];
    },

    bip39recorded: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/userbip39recorded`, data);
        return res.data || [];
    },

    getpassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password
        };
        let res = await axios.post(`/api/userpassphrase`, data);
        return res.data || [];
    },

    changepassword: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password,
            newpass: rdata.newpass
        };
        let res = await axios.post(`/api/userchangepassword`, data);
        return res.data || [];
    },

    usertwofactor: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/usertwofactor`, data);
        return res.data || [];
    },

    usertwofactorsave: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            password: rdata.password,
            pincode: rdata.pincode
        };
        let res = await axios.post(`/api/usertwofactorsave`, data);
        return res.data || [];
    },

    usertwofactordisable: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            pincode: rdata.pincode
        };
        let res = await axios.post(`/api/usertwofactordisable`, data);
        return res.data || [];
    },

    usergetemailauth: async (rdata) => {
        let data = {
            email: rdata.email,
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/usergetemailauth`, data);
        return res.data || [];
    },

    userresetpasspassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            word1: rdata.word1,
            word2: rdata.word2,
            word3: rdata.word3,
            word4: rdata.word4,
            word5: rdata.word5,
            word6: rdata.word6,
            word7: rdata.word7,
            word8: rdata.word8,
            word9: rdata.word9,
            word10: rdata.word10,
            word11: rdata.word11,
            word12: rdata.word12,
            password: rdata.password,
            authcode: rdata.authcode
        };
        let res = await axios.post(`/api/userresetpasspassphrase`, data);
        return res.data || [];
    },

    userresetpassnopassphrase: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            authcode: rdata.authcode
        };
        let res = await axios.post(`/api/userresetpassnopassphrase`, data);
        return res.data || [];
    },

    userresettwofactor: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            authcode: rdata.authcode,
            word1: rdata.word1
        };
        let res = await axios.post(`/api/userresettwofactor`, data);
        return res.data || [];
    },

    register: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            entity: rdata.entity,
            email: rdata.email,
            companyname: rdata.companyname,
            familyname: rdata.familyname,
            givenname: rdata.givenname,
            residence_country: rdata.residence_country,
            password: rdata.password,
            invitecode: rdata.invitecode
        };
        let res = await axios.post(`/api/auth/signup`, data);
        return res.data || [];
    },

    login: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            email: rdata.email,
            password: rdata.password,
            tfapin: rdata.tfapin
        };
        let res = await axios.post(`/api/auth/signin`, data);
        return res.data || [];
    },

    createrevolutorder: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount
        };
        let res = await axios.post(`/api/usercreaterevolutorder`, data);
        return res.data || [];
    },

    revolutpaymentapproved: async (rdata) => {

        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount,
            provider: rdata.provider,
            orderid: rdata.orderid
        };
        let res = await axios.post(`/api/userrevolutpaymentapproved`, data);
        return res.data || [];
    },

    createcoinpaymentsorder: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount,
            ticker: rdata.ticker
        };
        let res = await axios.post(`/api/usercreatecoinpaymentsorder`, data);
        return res.data || [];
    },

    selectdowngradeplan: async (rdata) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: rdata.plan,
            period: rdata.period,
            amount: rdata.amount
        };
        let res = await axios.post(`/api/userselectdowngradeplan`, data);
        return res.data || [];
    },

    updateprofilepic: async (image) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            image: image
        };
        let res = await axios.post(`/api/userupdateprofilepic`, data);
        return res.data || [];
    },

    updateprofilebg: async (image) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            image: image
        };
        let res = await axios.post(`/api/userupdateprofilebg`, data);
        return res.data || [];
    },

    setlanguage: async (language) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            language: language
        };
        let res = await axios.post(`/api/usersetlanguage`, data);
        return res.data || [];
    },

    getnotificationcount: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await axios.post(`/api/usergetnotificationcount`, data);
        return res.data || [];
    },

    getnotification: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await axios.post(`/api/usergetnotification`, data);
        return res.data || [];
    },

    getnotificationhistory: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetnotificationhistory`, data);
        return res.data || [];
    },

    getwalletaddresses: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await axios.post(`/api/usergetwalletaddresses`, data);
        return res.data || [];
    },

    getwalletbalance: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await axios.post(`/api/usergetwalletbalance`, data);
        return res.data || [];
    },

    getwallettransactions: async (walletid, skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetwallettransactions`, data);
        return res.data || [];
    },

    gettransaction: async (walletid, id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            id: id
        };
        let res = await axios.post(`/api/usergettransaction`, data);
        return res.data || [];
    },

    sendtransaction: async (walletid, contactid, address, amount, pass) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            contactid: contactid,
            address: address,
            amount: amount,
            pass: pass
        };
        let res = await axios.post(`/api/usersendtransaction`, data);
        return res.data || [];
    },

    sendqreditvote: async (walletid, tovote, pass) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid,
            tovote: tovote,
            pass: pass
        };
        let res = await axios.post(`/api/usersendqreditvote`, data);
        return res.data || [];
    },

    getdelegatelist: async (walletid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid
        };
        let res = await axios.post(`/api/usergetdelegatelist`, data);
        return res.data || [];
    },

    getwalletvotes: async (walletid) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            walletid: walletid
        };
        let res = await axios.post(`/api/usergetwalletvotes`, data);
        return res.data || [];
    },

    doqreditswap: async (passphrase) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            passphrase: passphrase
        };
        let res = await axios.post(`/api/userdoqreditswap`, data);
        return res.data || [];
    },

    getswaptransactions: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetswaptransactions`, data);
        return res.data || [];
    },

    getalltransactions: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetalltransactions`, data);
        return res.data || [];
    },

    createinvitation: async (emailphone) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            emailphone: emailphone
        };
        let res = await axios.post(`/api/usercreateinvitation`, data);
        return res.data || [];
    },

    getinvitations: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetinvitations`, data);
        return res.data || [];
    },

    getreferrals: async (skip, limit) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            skip: skip,
            limit: limit
        };
        let res = await axios.post(`/api/usergetreferrals`, data);
        return res.data || [];
    },

    getuserphones: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873"
        };
        let res = await axios.post(`/api/usergetphones`, data);
        return res.data || [];
    },

    getpincode: async (phone) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            phone: phone
        };
        let res = await axios.post(`/api/usergetpincode`, data);
        return res.data || [];
    },

    submitpincode: async (phone, pin) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            phone: phone,
            pin: pin
        };
        let res = await axios.post(`/api/usersubmitpincode`, data);
        return res.data || [];
    },

    setprimaryphone: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await axios.post(`/api/usersetprimaryphone`, data);
        return res.data || [];
    },

    getuseraddresses: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await axios.post(`/api/usergetaddresses`, data);
        return res.data || [];
    },

    addnewaddress: async (fields) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            line1: fields.line1,
            line2: fields.line2,
            city: fields.city,
            province: fields.province,
            postalcode: fields.postalcode,
            country: fields.country
        };
        let res = await axios.post(`/api/useraddnewaddress`, data);
        return res.data || [];
    },

    setprimaryaddress: async (id) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            id: id
        };
        let res = await axios.post(`/api/usersetprimaryaddress`, data);
        return res.data || [];
    },

    setnotification: async (item, value) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            item: item,
            value: value
        };
        let res = await axios.post(`/api/usersetnotification`, data);
        return res.data || [];
    },

    upgradeplan: async (plan) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            plan: plan,
        };
        let res = await axios.post(`/api/userupgradeplan`, data);
        return res.data || [];
    },

    getplans: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await axios.post(`/api/usergetplans`, data);
        return res.data || [];
    },

    getavailcryptocurr: async () => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
        };
        let res = await axios.post(`/api/usergetavailablecryptocurrencies`, data);
        return res.data || [];
    },

    createcryptowallet: async (ticker, password) => {
        let data = {
            serviceid: "60ead773c06b18e7e103d873",
            ticker: ticker,
            password: password
        };
        let res = await axios.post(`/api/usercreatecryptowallet`, data);
        return res.data || [];
    },


}

export default userService;