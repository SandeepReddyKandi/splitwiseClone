import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import "./login.css";
import letter from "../letter.webp";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import NavigationBarComponent from "./NavigationBarComponent";
import UserBackendAPIService from "../services/UserBackendAPIService";
import {useMutation} from "@apollo/client";
import {LOGIN_USER} from "../graphql/Mutations";

const LoginComponent = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
	});

	const dispatch = useDispatch();
	const history = useHistory();
	let [loginUser, {loading}] = useMutation(LOGIN_USER)

	const getRedirections = async () => {
		const { data, success } = await UserBackendAPIService.getUserDetails();
		if (success) {
			dispatch({
				type: "ADD_USER_DATA",
				payload: data
			});
			localStorage.setItem('token', JSON.stringify(data.token));
			history.push('/user/home');
		}
	}

	useEffect(() => {
		getRedirections();
	}, [])

	const handleLogin = async (e) => {
		e.preventDefault();
		const {data} = await loginUser({ variables: state });
		if (data && data.login.success) {
			toast.success("Successfully logged in!");
			dispatch({
				type: "ADD_USER_DATA",
				payload: data.login.data,
			});
			history.push('/user/home');
		} else if (data && !data.login.success) {
			toast.error(data.login.message);
		}
	}

	const handleChange = (e)=>{
		setState((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}));
	}

	return(
		<div className="login-page">
			<NavigationBarComponent />
			<div className="container loginArea">
				<div className="row loginBay center">
					<div className="col s6 right-align">
						<Link to="/">
							<img className="responsive-img" alt="letter" src={letter}/>
						</Link>
					</div>
					<div className="col s6 left-align">
						<h5 className="grey-text">WELCOME TO SPLITWISE</h5>
						<div className="loginDetails">
							<form className="loginForm">
								<div className="inputBox">
									<div className="input-field inputBar">
										<input id="email" type="email" className="validate" onChange={handleChange} value={state.email}/>
										<label htmlFor="email">Email</label>
									</div>
									<div className="input-field inputBar">
										<input id="password" type="password" className="validate" value={state.password} onChange={handleChange}/>
										<label htmlFor="password">Passwords</label>
									</div>
								</div>
								<button className="waves-effect waves-light btn-large orange darken-4" onClick={handleLogin}>
									Login
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			{
				loading && <div className='loader-overlay'>
					<div className="preloader-wrapper big active">
						<div className="spinner-layer spinner-blue-only">
							<div className="circle-clipper left">
								<div className="circle"></div>
							</div>
							<div className="gap-patch">
								<div className="circle"></div>
							</div>
							<div className="circle-clipper right">
								<div className="circle"></div>
							</div>
						</div>
					</div>
				</div>
			}
		</div>
	);
}

export default LoginComponent;
