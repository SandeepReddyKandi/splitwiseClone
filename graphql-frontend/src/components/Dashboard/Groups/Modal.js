import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import './Modal.css'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import {toast} from "react-toastify";
import {useMutation} from "@apollo/client";
import {CREATE_GROUP_EXPENSE} from "../../../graphql/Mutations";

const Modal = (props) => {
    let modal;
    const [state, setState] = useState({
        groupId: props.groupId,
        description: '',
        amount: '',
    });
    const [createExpense, {loading: createExpenseLoading}] = useMutation(CREATE_GROUP_EXPENSE);

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
    }, [])

    const setValues = (e) => {
        setState( (prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const addExpense = () => {
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;

        createExpense({
            variables: {
                userId,
                groupBody: {
                    groupId: state.groupId,
                    amount: state.amount,
                    description: state.description
                }
            }
        }).then(({data}) => {
            console.log('data', data);
            if (data && data.createGroupExpense.success) {
                toast.success(`Successfully added expense for amount ${state.amount}`);
                props.addExpense({
                    groupId: state.groupId,
                    expenses: [data.createGroupExpense.data[0]],
                })
            }
        });
    }

    return (
        <div>
            <a className=" btn modal-trigger red" data-target="modal1">
                Add an expense
            </a>

            <div ref={Modal => { modal = Modal; }} id="modal1" className="modal">
                <div className="modal-content right-align">
                    <div className="modal-title center-align">
                        <h5 className="row orange-text text-darken-2">Add new expense to the group</h5>
                    </div>
                    <div className="row right-align">
                        <div className="input-field col m12 s12">
                            <input placeholder="Expense item name"
                                   id="description"
                                   type="text"
                                   className=" input-field validate center-align"
                                   onChange={setValues}
                            />
                            <input placeholder="Cost of item"
                                   id="amount"
                                   type="number"
                                   className="input-field validate center-align"
                                   onChange={setValues}
                            />
                        </div>
                    </div>
                </div>
                <div className="row modal-footer">
                    <div className="col m12 center-align">
                        <a className="modal-close btn btn-success" onClick={addExpense}>
                            Save
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch)=>{
    return {
        addExpense : (state)=>{
            dispatch({
                type : "ADD_GROUP_EXPENSE",
                payload: state
            })
        }
    }
}

export default connect(null, mapDispatchToProps)(Modal);
