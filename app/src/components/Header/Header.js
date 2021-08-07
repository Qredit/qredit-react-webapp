import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/Header.css";

const Header = (props) => {
    // hide show header
    const [send, setSend] = useState(false);

    const handleToggle = () => {
        setSend(!send);
    };

    return (
        <>
            <section className={`zl_page_sidebar ${send ? "zl_hide_sidebar" : ""}`} title={props.title}>
                <div className="zl_page_sidebar_content">
                    <div className="zl_page_sidebar_logo">
                        <button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Link to={'/dashboard'}>
                            <img src="assets/img/header-logo.png" alt="logo" className="img-fluid zl_main_logo" />
                            <img src="assets/image/favicon.svg" alt="logo" className="img-fluid zl_mini_sidebar_logo" />
                            <img src="assets/img/header-logo.png" alt="light-logo" className="img-fluid zl_light_theme_logo d-none" />
                        </Link>
                    </div>
                    <ul className="zl_page_sidebar_nav">
                        <li className="zl_page_sidebar_items" title="dashboard">
                            <Link to={'/dashboard'} className="zl_page_sidebar_link position-relative">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
                                    <rect x="0.10527" y="6.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
                                    <rect x="6.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
                                    <rect x="6.10527" y="6.10527" width="7" height="7" rx="1.4" fill="#828CAE" />
                                </svg>
                                <span className="zl_pagesidebar_text">Dashboard</span>
                            </Link>
                        </li>
                        {/*
                        <li className="zl_page_sidebar_items" title="portfolio">
                            <Link to={'/portfolio'} className="zl_page_sidebar_link position-relative">
                                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.49548 17L9.49548 5.92954" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M13.515 17L13.515 2.91033" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M5.47666 17L5.47666 8.94876" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M1.45715 17L1.45715 10.9616" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M1.6745 7.32535L9.40402 1.04169" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                                <span className="zl_pagesidebar_text">Portfolio</span>
                            </Link>
                        </li>
                        */}
                        <li className="zl_page_sidebar_items" title="wallets">
                            <Link to={'/wallets'} className="zl_page_sidebar_link position-relative">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M2 0C0.895431 0 0 0.89543 0 2V11C0 12.1046 0.89543 13 2 13H11C12.1046 13 13 12.1046 13 11V2C13 0.895431 12.1046 0 11 0H2ZM7.5 5C6.67157 5 6 5.67157 6 6.5C6 7.32843 6.67157 8 7.5 8H9.5C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5H7.5Z"
                                        fill="#828CAE" />
                                </svg>
                                <span className="zl_pagesidebar_text">Wallets</span>
                                <span className="zl_page_sidebar_notification_dot"></span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="transactions">
                            <Link to={'/history'} className="zl_page_sidebar_link position-relative">
                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M7 7H0V0L2.79289 2.79289L3.85355 1.73222C4.24408 1.3417 4.87724 1.3417 5.26776 1.73222C5.65829 2.12275 5.65829 2.75591 5.26776 3.14644L4.2071 4.2071L7 7ZM15.2678 7.73224H8.26776L11.0607 10.5251L9.99999 11.5858C9.60947 11.9763 9.60947 12.6095 9.99999 13C10.3905 13.3905 11.0237 13.3905 11.4142 13L12.4749 11.9393L15.2678 14.7322V7.73224Z"
                                        fill="#828CAE" />
                                </svg>
                                <span className="zl_pagesidebar_text">Transactions</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="contacts">
                            <Link to={'/settings'} className="zl_page_sidebar_link position-relative">
                                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6.10996L16 6.10995L16 2.35996L13 2.35997L13 6.10996Z" stroke="#828CAE" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.5 6.25937L14.5 13.7594" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M7 9.10996L10 9.10995L9.99999 5.35996L6.99999 5.35997L7 9.10996Z" stroke="#828CAE" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.5 10.0094V13.7594" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.5 1.00937V4.75936" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.5 1.00937V1.75937" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M1.00001 12.1099L4 12.1099L3.99999 8.35993L0.999999 8.35994L1.00001 12.1099Z" stroke="#828CAE"
                                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.50001 8.35994L2.50001 0.859955" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M2.50001 13.61V12.86" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="zl_pagesidebar_text">Contacts</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="securebackup">
                            <Link to={'/securebackup'} className="zl_page_sidebar_link position-relative">
                                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.2624 2.75273L7.75463 0.0507634C7.59161 -0.0169045 7.40836 -0.0169377 7.24537 0.0507634L0.737553 2.75273C0.489691 2.85566 0.328125 3.09765 0.328125 3.36603V6.65065C0.328125 11.1733 3.06171 15.2416 7.24905 16.9508C7.40989 17.0164 7.59008 17.0164 7.75095 16.9508C11.9382 15.2417 14.6719 11.1734 14.6719 6.65065V3.36603C14.6719 3.09765 14.5103 2.85566 14.2624 2.75273Z"
                                        fill="#828CAE" />
                                    <path
                                        d="M6.76601 8.88901L9.62029 6.03477C9.8796 5.77545 10.3001 5.77542 10.5594 6.03477C10.8188 6.29412 10.8187 6.71457 10.5594 6.97389L7.23557 10.2977C6.97619 10.5571 6.55574 10.557 6.29645 10.2977L4.4406 8.44183C4.18125 8.18248 4.18125 7.76203 4.4406 7.50271C4.69995 7.2434 5.1204 7.24336 5.37972 7.50271L6.76601 8.88901Z"
                                        fill="#252F47" />
                                </svg>
                                <span className="zl_pagesidebar_text">Security Backup</span>
                            </Link>
                        </li>
                        <li className="zl_page_sidebar_items" title="settings">
                            <Link to={'/settings'} className="zl_page_sidebar_link position-relative">
                                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6.10996L16 6.10995L16 2.35996L13 2.35997L13 6.10996Z" stroke="#828CAE" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.5 6.25937L14.5 13.7594" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M7 9.10996L10 9.10995L9.99999 5.35996L6.99999 5.35997L7 9.10996Z" stroke="#828CAE" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.5 10.0094V13.7594" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.5 1.00937V4.75936" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.5 1.00937V1.75937" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M1.00001 12.1099L4 12.1099L3.99999 8.35993L0.999999 8.35994L1.00001 12.1099Z" stroke="#828CAE"
                                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.50001 8.35994L2.50001 0.859955" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M2.50001 13.61V12.86" stroke="#828CAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="zl_pagesidebar_text">Settings</span>
                            </Link>
                        </li>
                    </ul>
                    <button className="zl_page_sidebar_toggle_icon" onClick={handleToggle}>
                        <img src="assets/image/right-two-arrow.svg" alt="right-two-arrow" />
                    </button>
                </div>
            </section>
            <button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </>
    );
}

export default Header;
