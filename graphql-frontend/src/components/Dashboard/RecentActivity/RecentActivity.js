import React, {useEffect, useState} from 'react';
import {connect, useSelector} from 'react-redux';
import {useLazyQuery} from "@apollo/client";
import ExpenseList from './ExpenseList';
import '../dashboard.scss';
import {GET_RECENT_ACTIVITIES} from "../../../graphql/Queries";

const RecentActivityComponent = (props)=>{
    const [selectedPageSize, setSelectedPageSize] = useState(2);
    const [selectedPageNumber, setSelectedPageNumber] = useState(1);
    const [getRecentActivities, {loading: recentLoading, data: recentData}] = useLazyQuery(GET_RECENT_ACTIVITIES);
    const {activities, token, userId} = useSelector(state => {
        return {
            activities: state.expenseState.recentActivities,
            token : state.userState.user.token,
            userId : state.userState.user.id
        }
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [paginatedResults, setPaginatedResults] = useState([]);

    useEffect(() => {
        getRecentActivities({
            variables: {
                userId
            }
        })
    },[]);

    useEffect(() => {
        if (!recentLoading) {
            if (recentData && recentData.getRecentExpenses.success) {
                const data = [...recentData.getRecentExpenses.data];
                setRecentActivities(data);
                setPaginatedResults(data.slice(0, selectedPageSize));
            }
        }
    }, [recentLoading]);

    const changePage = (pageNo) => {
        setSelectedPageNumber(pageNo);
        setPaginatedResults(recentActivities.slice((pageNo - 1) * selectedPageSize,pageNo * selectedPageSize))
    }

    useEffect(() => {
        // getPages();
        changePage(1);
    }, [selectedPageSize]);

    const getPages = () => {
        if (recentActivities.length && selectedPageSize) {
            const totalPages = Array.from(Array(Math.ceil(recentActivities.length / selectedPageSize)).keys());
            return totalPages.map(page => {
                return <span onClick={() => changePage(page + 1)} className={selectedPageNumber === (page + 1) && 'selected'}>{page + 1}</span>
            });
        }
    }

    return (
        <div className="container user-groups">
            <div className="row">
                <div className="recent-activity-col col m8 z-depth-1">
                    <div className="header row valign-wrapper grey lighten-2">
                        <div className="header-col col m12 valign-wrapper">
                            <span className="center-align">Recent activity</span>
                        </div>
                    </div>
                    {
                        paginatedResults ? (
                            <div>
                                <table className="centered highlight expenses-list-table">
                                    {paginatedResults.length ? <ExpenseList recentActivities={paginatedResults} userId={userId} key={selectedPageSize}/> : <div>Loading...</div>}
                                </table>
                                <div className='pagination-cont'>
                                    <select onChange={(e) => setSelectedPageSize(e.target.value)}>
                                        {
                                            [2,5,10,15].map(item => {
                                                return (
                                                    <option value={item} selected={selectedPageSize === item}>
                                                        {item} Items {item=== 2 && '(DEFAULT)'}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className='pages'>
                                        {getPages()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row container">
                                <div className="col m12 s12">
                                    No recent activity
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) =>{
    return {
        addRecentActivities: (state)=>{
            dispatch({
                type: "ADD_ACTIVITIES",
                payload: state
            });
        }
    };
};

export default connect(null, mapDispatchToProps)(RecentActivityComponent);
