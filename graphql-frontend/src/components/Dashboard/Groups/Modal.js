import React, {Component} from "react";
import {connect} from "react-redux";
import './Modal.css'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import ExpenseBackendAPIService from "../../../services/ExpenseBackendAPIService";
import {toast} from "react-toastify";

class Modal extends Component {
    state = {
        groupId: this.props.groupId,
        description: '',
        amount: '',
    }

  componentDidMount() {
    const options = {
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);
  }

  setValues = (e)=>{
      this.setState({
        [e.target.id] : e.target.value
      })
  }

  addExpense = () => {
    ExpenseBackendAPIService.createExpense({
      groupId : this.state.groupId,
      amount: this.state.amount,
      description: this.state.description
    }).then(({data, success})=>{
            if(success && data && data.length){
              toast.success(`Successfully added expense for amount ${this.state.amount}`);
              this.props.addExpense({
                  groupId: this.state.groupId,
                  expenses: [data[0]],
              })
            }
    });
  }

  render() {
    return (
      <div>
        <a
          className=" btn modal-trigger red"
          data-target="modal1"
        >
          Add an expense
        </a>

        <div ref={Modal => {
            this.Modal = Modal;
          }}
          id="modal1"
          className="modal"
        >
            <div className="modal-content right-align">
                <div className="modal-title center-align">
                  <h5 className="row orange-text text-darken-2">Add new expense to the group</h5>
                </div>
                <div className="row right-align">
                    <div className="input-field col m12 s12">
                        <input placeholder="Expense item name" id="description" type="text" className=" input-field validate center-align"
                            onChange={this.setValues}
                        />
                        <input placeholder="Cost of item" id="amount" type="number" className="input-field validate center-align"
                            onChange={this.setValues}
                        />
                    </div>
                </div>
            </div>
            <div className="row modal-footer">
                <div className="col m12 center-align">
                    <a className="modal-close btn btn-success" onClick={this.addExpense}>
                    Save
                    </a>
                </div>
            </div>
        </div>
      </div>
    );
  }
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
