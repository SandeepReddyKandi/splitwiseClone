import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './Modal.css'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import {toast} from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_USERS} from "../../../graphql/Queries";
import {SETTLE_EXPENSE} from "../../../graphql/Mutations";

const Modal = () => {
    let modal;
    const [getAllUsers, {loading: getUsersLoading, data: allUsersRes}] = useLazyQuery(GET_USERS);
    const [settleBalanceMutation, {loading: settleBalanceLoading, data: settleBalanceData}] = useMutation(SETTLE_EXPENSE);

    const dispatch = useDispatch();
    const {userInfo, usersList} = useSelector(state => ({
        userInfo: state.userState.user,
        usersList: state.userState.usersList,
    }))

    const [state, setState] = useState({
        userId: userInfo.id,
        name: "",
        completeUserList: [],
        selectedPerson: '',
    });

    useEffect(() => {
        const options = {
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: true,
            startingTop: "4%",
            endingTop: "10%"
        };
        M.Modal.init(modal, options);

        if (!usersList.length) {
            getAllUsers();
            return;
        }

        setState((prevState) => ({
            ...prevState,
            completeUserList: usersList.map(user => {
                return {
                    label: user.name,
                    id: user.id,
                    email: user.email,
                    isAdded: userInfo.id === user.id,
                }
            })
        }))
    }, [])

    useEffect(() => {
        if (!getUsersLoading) {
            if (allUsersRes && allUsersRes.users.success) {
                setState((prevState) => ({
                    ...prevState,
                    completeUserList: allUsersRes.users.data.map(user => {
                        return {
                            label: user.name,
                            id: user.id,
                            email: user.email,
                            isAdded: userInfo.id === user.id,
                        }
                    })
                }))
            } else if (allUsersRes && !allUsersRes.users.success) {
                toast.error(allUsersRes.users.message);
            }
        }
    }, [getUsersLoading])

    const setUserName = (e) => {
        setState({
            [e.target.id]: e.target.value
        })
    }

    const settleBalance = () => {
        dispatch({
            type : "DELETE_USER",
            payload: state
        });
    }

    const onSelectPersonHandler = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        if (selectedOption.id) {
            setState({
                ...state,
                selectedPerson: {
                    name: selectedOption.getAttribute('name'),
                    id: selectedOption.value,
                    email: selectedOption.id
                }
            })
        }
    }

    const addAPersonToGroup = () => {
        // console.log('selected person : ',state.selectedPerson.id, '  _user : ', state.userId);
        settleBalanceMutation({
            variables: {
                userId: state.userId,
                user2Id: state.selectedPerson.id
            }
        }).then(({data}) => {
            if (data && data.settleExpense.success) {
                toast.success('Expenses Settled with ' + state.selectedPerson.name);
            }
        });
    }

    return (
        <div>
            <div ref={Modal => {
                modal = Modal;
            }}
                 id="modal1"
                 className="modal"
            >
                <div className="modal-content center-align">
                    <div className="modal-title">
                        <h5 className="orange-text text-darken-2">Settle Balance</h5>
                    </div>
                    <div className="row center-align">
                        <div className="input-field col m12 s12">
                            <select
                                value={state.selectedPerson ? state.selectedPerson.id : null}
                                name={'select-person'}
                                onChange={onSelectPersonHandler}
                            >
                                <option>Select a person</option>
                                {
                                    state.completeUserList.filter(user => !user.isAdded).map(user => {
                                        return (
                                            <option
                                                value={user.id}
                                                id={user.email}
                                                name={user.label}
                                            >
                                                {user.label.toUpperCase()} ({user.email})
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row modal-footer">
                    <div className="col m12 center-align">
                        <button
                            className="modal-close btn orange darken-3"
                            onClick={addAPersonToGroup}
                            disabled={!state.selectedPerson}
                        >
                            Settle Balance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
