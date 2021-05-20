import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import letter from "../../letter.webp";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from "react-router-dom";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_USERS} from "../../graphql/Queries";
import {CREATE_GROUP} from "../../graphql/Mutations";

const CreateNewGroup = () => {
	const [state, setState] = useState({
		name: "",
		userIds: [],
		completeUserList: [],
		selectedPerson: '',
		userIdToNameMap: {},
		filterText: '',
	})

	const dispatch = useDispatch()
	const history = useHistory()

	const {usersList} = useSelector(state => ({
		usersList: state.userState.usersList,
	}))

	const [getAllUsers, {loading: getUsersLoading, data: allUsersRes}] = useLazyQuery(GET_USERS);
	const [createGroup, {loading: createGroupLoading, data: createGroupData}] = useMutation(CREATE_GROUP);

	const {userInfo} = useSelector(state => {
		return {
			userInfo : state.userState.user
		}
	});

	const handleChange = (e) => {
		setState((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}));
	}

	useEffect(() => {
		if (!usersList.length) {
			getAllUsers();
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

	useEffect(() => {
		if (!createGroupLoading) {
			if (createGroupData && createGroupData.createGroup.success) {
				toast.success(`Group "${state.name}" has been created successfully!`);
				dispatch({
					type : 'ADD_ACTIVE_GROUP',
					payload : [{
						id:  createGroupData.createGroup.data.id,
						name:  createGroupData.createGroup.data.name,
					}]
				});
				history.push('/user/home/invites');
			} else if (createGroupData && !createGroupData.createGroup.success){
				toast.error(createGroupData.createGroup.message);
			}
		}
	}, [createGroupLoading])

	// submitting the store data to db
	const createNewGroup = (e) => {
		e.preventDefault();
		if (state.name === '') {
			toast.error("Please add a name to your group");
		} else {
			console.log('userInfo.id', userInfo.id)
			createGroup({
				variables: {
					userId: userInfo.id,
					data : {
						name: state.name,
						invitedUsers: state.userIds.map(user => user.id)
					}
				}
			})
		}
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

	const optionSelected = (user) => {
		setState({
			...state,
			filterText: `${user.label.toUpperCase()} (${user.email})`,
			selectedPerson: {
				name: user.label,
				id: user.id,
				email: user.email
			}
		});
	}

	const addAPersonToGroup = () => {
		setState((prevState) => ({
			...prevState,
			userIds: [...prevState.userIds, prevState.selectedPerson],
			selectedPerson: '',
			filterText: '',
			completeUserList: prevState.completeUserList.map(user => {
				return {
					...user,
					isAdded: [prevState.selectedPerson.id, userInfo.id].includes(user.id),
				}
			})
		}));
	}
	console.log('state.completeUserList    ', state);
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
						<input id="name" type="text" className="validate" onChange={handleChange} required/>
						<label htmlFor="name">My group shall be called</label>
					</div>
				</div>
				<div className="row group-members">
					<p className="grey-text">Group members</p>
					<div className="row group-member valign-wrapper">
						<div className="col m12" id="usersList">
								<span className="center-align valign-wrapper">
									<img className="responsive-img"
										 src="https://img.icons8.com/nolan/64/user-male-circle.png" alt={'i'}/>
									({userInfo.name}) ({userInfo.email})
								</span>
						</div>
					</div>
					{
						state.userIds.length > 0 &&
						(
							state.userIds.map((user) => {
								return (
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
							<input type="text" id="filterText" name="filterText" value={state.filterText}
								   onChange={handleChange} placeholder={'Search for your friends'}/>
						</div>
						<div>
							<select
								value={state.selectedPerson ? state.selectedPerson.id : null}
								name={'select-person'}
								className='users-select'
								onChange={onSelectPersonHandler}
								size={state.completeUserList.filter(user => !user.isAdded && `${user.label.toUpperCase()} (${user.email})`.indexOf(state.filterText.toLowerCase()) !== -1 && state.filterText).length + 1}
							>
								<option>Select a person</option>
								{
									state.completeUserList.filter(user => !user.isAdded && `${user.label.toUpperCase()} (${user.email})`.indexOf(state.filterText.toLowerCase()) !== -1 && state.filterText).map(user => {
										return (
											<option
												value={user.id}
												id={user.email}
												name={`${user.label.toUpperCase()} (${user.email})`}
												onClick={() => optionSelected(user)}
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
						onClick={addAPersonToGroup}
						disabled={!state.selectedPerson}
					>Add a person
					</button>
					<button
						className="btn  green darken-1"
						onClick={createNewGroup}
						disabled={!state.name || !state.userIds.length}
					>Create Group
					</button>
				</div>
			</div>
		</div>
	);
}

export default CreateNewGroup;






