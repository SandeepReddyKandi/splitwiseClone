import {gql} from "apollo-server-express";

import userTypedef from './User';
import expenseTypedef from './Expense';
import groupTypedef from './Group';
import postTypedef from './Post';

const typeDefs = gql`
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    ${userTypedef}
    ${expenseTypedef}
    ${groupTypedef}
    ${postTypedef}
`;


export default typeDefs
