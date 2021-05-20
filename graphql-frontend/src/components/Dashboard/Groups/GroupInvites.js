import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import '../dashboard.scss'
import {toast} from "react-toastify";
import SearchComponent from "./SearchComponent";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_ALL_GROUPS} from "../../../graphql/Queries";
import {ACCEPT_INVITE, LEAVE_GROUP} from "../../../graphql/Mutations";

const Invites = (props)=>{
    const [invitedGroups, setInvitedGroups] = useState(props.invitedGroups || []);
    const [acceptedGroups, setAcceptedGroups] = useState(props.acceptedGroups || []);
    const [getAllGroups, {loading: allGroupsLoading, data: allGroupsData}] = useLazyQuery(GET_ALL_GROUPS);
    const [acceptInvite, {loading: acceptInviteLoading, data: acceptInviteData}] = useMutation(ACCEPT_INVITE);
    const [leaveGroupMutation, {loading: leaveGroupLoading, data: leaveGroupData}] = useMutation(LEAVE_GROUP)
    console.log('allGroupsData', allGroupsLoading, allGroupsData);
    useEffect(() => {
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;
        getAllGroups({
            variables: {
                userId,
            }
        });
    },[]);

    useEffect(() => {
        if (!allGroupsLoading || allGroupsData) {
            if (allGroupsData && allGroupsData.getAllGroups.success) {
                props.addActiveGroups(allGroupsData.getAllGroups.data.acceptedGroups);
                props.addInvites(allGroupsData.getAllGroups.data.invitedGroups);
                setInvitedGroups(allGroupsData.getAllGroups.data.invitedGroups.map(group => {
                    return {
                        ...group,
                        show: true,
                    }
                }));
                setAcceptedGroups(allGroupsData.getAllGroups.data.acceptedGroups.map(group => {
                    return {
                        ...group,
                        show: true,
                    }
                }))
            } else if (allGroupsData && !allGroupsData.getAllGroups.success) {
                toast.error(allGroupsData.getAllGroups.message);
            }
        }
    }, [allGroupsLoading]);

    const acceptInvitation = (invite) => {
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;
        acceptInvite({
            variables: {
                userId,
                groupId: invite.id,
            }
        }).then(({data}) => {
            console.log(data.acceptGroupInvite);
            if(data.acceptGroupInvite.success){
                toast.success(`Invite for the ${invite.name} accepted successfully!`)
                props.acceptGroupInvite([invite]);
                setInvitedGroups(invitedGroups.filter(group => group.id !== invite.id))
                setAcceptedGroups([...acceptedGroups, invite]);
            } else {
                toast.error(data.acceptGroupInvite.message);
            }
        })
    }

    const leaveGroup = (invite, isInvitedGroup)=>{
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;
        leaveGroupMutation({
            variables: {
                userId,
                groupId: invite.id,
            }
        }).then(({data})=>{
            if(data.leaveGroup.success){
                toast.info(`Successfully Left the group ${invite.name}!`);
                if (isInvitedGroup) {
                    props.removeInvites(invite);
                    setInvitedGroups(invitedGroups.filter(group => group.id !== invite.id))
                } else {
                    props.removeActiveGroups(invite);
                    setAcceptedGroups(acceptedGroups.filter(group => group.id !== invite.id))
                }
            } else {
                toast.error(data.leaveGroup.message);
            }
        })
    }


    const searchGroup = (searchString) => {
        setAcceptedGroups([...acceptedGroups.map(group => {
            return {
                ...group,
                show: group.name.toLowerCase().includes(searchString),
            }
        })]);
        setInvitedGroups([...invitedGroups.map(group => {
            return {
                ...group,
                show: group.name.toLowerCase().includes(searchString),
            }
        })])

    }

    return(
        <div className="container user-groups">
            <div className="row">
                <div className="col m8 z-depth-1">
                    <div className="header row valign-wrapper grey lighten-2">
                        <div className="col m12 valign-wrapper">
                            <span className="center-align">My Groups</span>
                        </div>
                    </div>
                    <div>
                        <SearchComponent searchGroup={searchGroup}/>
                        <table className="centered highlight expenses-list-table">
                            <tbody>
                            {
                                invitedGroups.filter(group => group.show).map((invite) => {
                                    return (
                                        <tr className="left-align grey lighten-4" key={props.invitedGroups.id}>
                                            <td className="grey-text text-darken-2">
                                                <h6>{invite.name}</h6>
                                            </td>
                                            <td className="left-align">
                                                <a
                                                    className="btn-floating waves-light green add"
                                                    onClick={() => acceptInvitation(invite)}
                                                >
                                                    <i className="material-icons">add</i>
                                                </a>
                                                <span style={{marginLeft: "10px"}}/>
                                                <a
                                                    className="btn-floating waves-light red delete"
                                                    onClick={() => leaveGroup(invite, true)}
                                                >
                                                    <i className="material-icons">clear</i>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                acceptedGroups.filter(group => group.show).map((invite) => {
                                    return (
                                        <tr className="left-align" key={props.activeGroups.id}>
                                            <td className="grey-text text-darken-2">
                                                <h6>{invite.name}</h6>
                                            </td>
                                            <td className="left-align">
                                                <a
                                                   className="btn-floating waves-light red delete"
                                                   onClick={() => leaveGroup(invite)}
                                                >
                                                    <i className="material-icons">clear</i>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        activeGroups: state.groupState.acceptedGroups.map(group => {
            return {
                ...group,
                show: true,
            }
        }),
        invitedGroups: state.groupState.invitedGroups.map(group => {
            return {
                ...group,
                show: true,
            }
        })
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        addActiveGroups : (state)=>{
            dispatch({
                type : 'ADD_ACTIVE_GROUPS',
                payload: state
            });
        },
        acceptGroupInvite : (state)=>{
            dispatch({
                type : 'ACCEPT_GROUP_INVITE',
                payload: state
            });
        },
        addInvites: (state)=>{
            dispatch({
                type : 'ADD_INVITES',
                payload: state
            })
        },
        removeActiveGroups : (state)=>{
            dispatch({
                type : 'REMOVE_ACTIVE_GROUPS',
                payload: state
            });
        },
        removeInvites: (state)=>{
            dispatch({
                type : 'REMOVE_INVITES',
                payload: state
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Invites);
