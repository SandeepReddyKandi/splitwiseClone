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
import {useLazyQuery} from "@apollo/client";
import {GET_USER_DETAIL, GET_USERS} from "./graphql/Queries";

function App(props) {
    const [getAllUsers, {loading: getUsersLoading, data: allUsersRes}] = useLazyQuery(GET_USERS);
    const [getUserDetails, { loading: userDetailLoading, data: usersResData }] = useLazyQuery(GET_USER_DETAIL);
    useEffect(() => {
        // Read the token from localstorage
        initReduxStore();
    }, []);

    useEffect(() => {
       if (!userDetailLoading) {
           if (usersResData && usersResData.getUserDetails.success) {
               props.updateUserData(usersResData.getUserDetails.data);
               getAllUsers();
               console.log(`Already Logged In As ${usersResData.getUserDetails.data.name}`);
           } else if (usersResData && !usersResData.getUserDetails.success){
               console.log('Please Login Or Signup');
           }
       }
    }, [userDetailLoading]);

    useEffect(() => {
        if (!getUsersLoading) {
            if (allUsersRes && allUsersRes.users.success) {
                props.addUsersList(allUsersRes.users.data);
            }
        }
    }, [getUsersLoading]);

    const initReduxStore = async () => {
        const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;
        if (token) {
            getUserDetails({
                variables: {
                    userId,
                }
            });
        }
    }

    return (
        <BrowserRouter>
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

