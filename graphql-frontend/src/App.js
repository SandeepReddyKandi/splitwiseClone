import React, {useEffect} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import SignUpComponent from "./components/SignUpComponent";
import HomeComponent from "./components/HomeComponent";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './components/Dashboard/Dashboard';
import User from './components/Dashboard/User/User';
import ProtectedRoute from "./components/ProtectedRoute";
import UserBackendAPIService from "./services/UserBackendAPIService";
import {connect} from "react-redux";
import "./App.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

function App(props) {
    useEffect(() => {
        // Read the token from localstorage
        initReduxStore();
    }, []);

    const initReduxStore = async () => {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
        if (token) {
            const user = await UserBackendAPIService.getUserDetails();
            if (user.success) {
                props.updateUserData(user.data);
                const allUsersRes = await UserBackendAPIService.getAllUsers();
                console.log(allUsersRes)
                props.addUsersList(allUsersRes);
                console.log(`Already Logged In As ${user.data.name}`);
            } else {
                console.log('Please Login Or Signup');
            }
        }
    }

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: process.env.REACT_APP_GRAPHQL_API_URI
    })

    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <div className="App">
                    <ToastContainer/>
                    <Route exact path="/" component={HomeComponent}/>
                    <Route path="/login" component={LoginComponent}/>
                    <Route path="/signup" component={SignUpComponent}/>
                    <Route exact path="/user" component={() => {
                        return (
                            <ProtectedRoute>
                                <User />
                            </ProtectedRoute>
                        )
                    }}/>
                    <Route path="/user/home" component={() => {
                        return (
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        )
                    }}/>
                </div>
            </ApolloProvider>
        </BrowserRouter>
    );
}

const mapDispatchToProps = (dispatch)=>{
    return {
        updateUserData : (state) => {
            dispatch({
                type : "ADD_USER_DATA",
                payload: state
            })
        },
        addUsersList : (state) => {
            dispatch({
                type : "ADD_USER_LISTS",
                payload: state
            })
        }
    }
}


export default connect(null, mapDispatchToProps)(App);

