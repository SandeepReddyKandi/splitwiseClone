import { ApolloServer, gql } from "apollo-server-express";
import express from 'express';

const app = express();


const typeDefs = gql`
    type Query {
        hello: String!
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello!!"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.applyMiddleware({ app })

app.listen( { port: 4000 }, () => {
        console.log(`Server ready on http://localhost:4000${server.graphqlPath}`)
})
