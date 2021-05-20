import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import "./login.css";
import letter from "../letter.webp";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import NavigationBarComponent from "./NavigationBarComponent";
import UserBackendAPIService from "../services/UserBackendAPIService";
import {useLazyQuery, useMutation} from "@apollo/client";
import {LOGIN_USER} from "../graphql/Mutations";
import LoadingComponent from "./LoadingComponent";
import {GET_USER_DETAIL} from "../graphql/Queries";

const LoginComponent = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
	});

	const dispatch = useDispatch();
	const history = useHistory();
	let [loginUser, {loading}] = useMutation(LOGIN_USER)
	const [getUserDetails, { loading: userDetailLoading, data: usersResData }] = useLazyQuery(GET_USER_DETAIL);

	useEffect(() => {
		const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
		const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;
		if (token) {
			getUserDetails({
				variables: {
					userId,
				}
			});
		}
	}, [])

	useEffect(() => {
		console.log('userDetailLoading', userDetailLoading)
		if (!userDetailLoading) {
			if (usersResData && usersResData.getUserDetails.success) {
				dispatch({
					type: "ADD_USER_DATA",
					payload: usersResData.getUserDetails.data
				});
				history.push('/user/home');
			}
		}
	}, [userDetailLoading]);

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
				loading && <LoadingComponent/>
			}
		</div>
	);
}

export default LoginComponent;
