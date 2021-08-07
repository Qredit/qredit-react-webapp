import { useEffect } from "react";
import store from "../js/store/index";

function ScrollToTop({ children }) {

	let state = store.getState();
	
	let pathname = state.requestedPage;
	 
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	 
	return children;
}
 
export default ScrollToTop;
