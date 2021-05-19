import React, {Component} from "react";
import {connect} from "react-redux";
import letter from "../../letter.webp";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {withRouter} from "react-router-dom";
import GroupBackendAPIService from "../../services/GroupBackendAPIService";

const API_ENDPOINT = process.env.REACT_APP_ENDPOINT;

class CreateNewGroup extends Component {
	state = {
		name: "",
		userIds: [],
		completeUserList: [],
		selectedPerson: '',
		userIdToNameMap: {},
		filterText: '',
	}

	handleChange = (e) => {
		this.setState({
			[e.target.id] : e.target.value
		});
	}
	componentDidMount() {
        const token = JSON.parse(localStorage.getItem('token'));
		axios.get(`${API_ENDPOINT}/user/all`, {
			headers: {
				authorization: `Bearer ${token}`,
			}
		}).then(res => {
			if (res.data.success) {
				this.setState({
					...this.state,
					completeUserList: res.data.data.map(user => {
						return {
							label: user.name,
							id: user.id,
							email: user.email,
							isAdded: this.props.userInfo.id === user.id,
						}
					}),
				})
			} else {
				toast.error(res.data.reason);
			}
		})
	}

	// submitting the store data to db
	createNewGroup = (e) => {
		e.preventDefault();
		if (this.state.name === '') {
			toast.error("Please add a name to your group");
		} else {
			GroupBackendAPIService.createGroup({
				name: this.state.name,
				invitedUsers: this.state.userIds.map(user => user.id)
			}).then(({data, success}) => {
				if (success) {
					toast.success(`Group "${this.state.name}" has been created successfully!`);
					this.props.addActiveGroup([{
						id: data.id,
						name: data.name,
					}]);
					this.props.history.push('/user/home/invites');
				} else {
					toast.error(data.reason);
				}
			})
		}
	}

	onSelectPersonHandler = (e) => {
		const selectedOption = e.target.options[e.target.selectedIndex];
		if (selectedOption.id) {
			this.setState({
				...this.state,
				selectedPerson: {
					name: selectedOption.getAttribute('name'),
					id: selectedOption.value,
					email: selectedOption.id
				}})
		}
	}

	optionSelected = (user) => {
		this.setState({
			...this.state,
			filterText: `${user.label.toUpperCase()} (${user.email})`,
			selectedPerson: {
				name: user.label,
				id: user.id,
				email: user.email
			}
		});

	}

 	addAPersonToGroup = () => {
		 this.setState((prevState) => {
			 return {
				 ...prevState,
				 userIds: [...prevState.userIds, prevState.selectedPerson],
				 selectedPerson: '',
				 filterText: '',
				 completeUserList: prevState.completeUserList.map(user => {
					 return {
						 ...user,
						 isAdded: [prevState.selectedPerson.id, this.props.userInfo.id].includes(user.id),
					 }
				 })
			 }
		 });
	}

	render() {
		return (
			<div className="container row new-group">
				<div className="col m4 center-align" id="groupLeftSide">
					<img className="responsive-img" src={letter} alt="letter"/>
					<div className="change-avatar center-align">
						<p>Change Group Image</p>
						<input className="center-align" type="file"/>
					</div>
				</div>
				<div className="col m7" id="groupRightSide">
					<h5 className="grey-text">Start a new group</h5>
					<div className="row group-name">
						<div className="input-field col m12">
							<input id="name" type="text" className="validate" onChange={this.handleChange} required/>
							<label htmlFor="name">My group shall be called</label>
						</div>
					</div>
					<div className="row group-members">
						<p className="grey-text">Group members</p>
						<div className="row group-member valign-wrapper">
							<div className="col m12" id="usersList">
								<span className="center-align valign-wrapper">
									<img className="responsive-img" src="https://img.icons8.com/nolan/64/user-male-circle.png" alt={'i'}/>
									({this.props.userInfo.name}) ({this.props.userInfo.email})
								</span>
							</div>
						</div>
						{
							this.state.userIds.length > 0 &&
							(
								this.state.userIds.map((user)=>{
									return(
										<div className="row group-member valign-wrapper">
											<div className="col m12" id="usersList">
												<span className="center-align valign-wrapper">
													<img
														className="responsive-img"
														src="https://img.icons8.com/nolan/64/user-male-circle.png"
														alt=""
													/>
													({user.name}) ({user.email})
												</span>
											</div>
										</div>
									)
								})
							)
						}
					</div>
					<div className="row" id="add-person-container">
						<div>
							<div>
								<input type="text" id="filterText" name="filterText" value={this.state.filterText} onChange={this.handleChange} placeholder={'Search for your friends'}/>
							</div>
							<div>
								<select
									value={this.state.selectedPerson ? this.state.selectedPerson.id : null}
									name={'select-person'}
									className='users-select'
									onChange={this.onSelectPersonHandler}
									size={this.state.completeUserList.filter(user => !user.isAdded && `${user.label.toUpperCase()} (${user.email})`.indexOf(this.state.filterText.toLowerCase()) !== -1 && this.state.filterText).length + 1}
								>
									<option>Select a person</option>
									{
										this.state.completeUserList.filter(user => !user.isAdded && `${user.label.toUpperCase()} (${user.email})`.indexOf(this.state.filterText.toLowerCase()) !== -1 && this.state.filterText).map(user => {
											return (
												<option
													value={user.id}
													id={user.email}
													name={`${user.label.toUpperCase()} (${user.email})`}
													onClick={() => this.optionSelected(user)}
												>{user.label.toUpperCase()} ({user.email})</option>
											)
										})
									}
								</select>
							</div>
						</div>

					</div>
					<div className="row">
						<button
							className="btn orange darken-3 m-r-10"
							onClick={this.addAPersonToGroup}
							disabled={!this.state.selectedPerson}
						>Add a person</button>
						<button
							className="btn  green darken-1"
							onClick={this.createNewGroup}
							disabled={!this.state.name || !this.state.userIds.length}
						>Create Group</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state)=>{
    return {
        userInfo : state.userState.user,
    }
}

const mapDispatchToProps = (dispatch)=>{
	return {
		addActiveGroup : (state)=>{
			dispatch({
				type : 'ADD_ACTIVE_GROUP',
				payload : state
			})
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewGroup));
