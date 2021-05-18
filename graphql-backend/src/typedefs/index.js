import userTypedef from './User';
import expenseTypedef from './Expense';
import {gql} from "apollo-server-express";

const typeDefs = gql`
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    ${userTypedef}
    ${expenseTypedef}
`;


export default typeDefs
