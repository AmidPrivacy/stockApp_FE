import axios from "axios";
import config from "../lib/config/app";
import { message } from 'antd';


  
export const createOrder = (body: Object) => {
	return axios.post(config().apiUrl + "/user/orders", body, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
};

export const offerOrder = (body: Object, id: number) => {
	return axios.post(config().apiUrl + `/seller/orders/${id}/offer`, body, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
}; 

export const fetchOrderList = (page:any={}, search:any = {}) => {  
	const type = sessionStorage.getItem("role") ==="seller" ? "seller" : "user"; 
	page = page === null ? {} : {
		offset: page.pageSize,
		page: page.current
	};
	return axios.get(config().apiUrl + `/${type}/orders`, { headers: config().headers, params: { ...page, ...search } }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
}; 

export const fetchStatusList = () => {  
	return axios.get(config().apiUrl + `/list/order-statuses`, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
};  


export const deleteOrder = (id: number) => {
	return axios.post(config().apiUrl + `/user/orders/${id}/cancel`, {}, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
};

export const acceptOrder = (id: number) => {
	return axios.post(config().apiUrl + `/${sessionStorage.getItem("role")}/orders/${id}/accept`, {}, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
};

export const rejectOrder = (id: number) => {
	const path = sessionStorage.getItem("role")==="seller" ? `/seller/orders/${id}/reject` : `/user/orders/${id}/cancel`;
	return axios.post(config().apiUrl + path, {}, { headers: config().headers }).catch(err => {
		console.log(err);
		message.error("Sistem xətası");
	});
};