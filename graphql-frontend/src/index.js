import React from "react";
import {createStore} from "redux";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {Provider} from "react-redux";
import rootReducer from "./reducers/rootReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import {ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const store = createStore(
  rootReducer,
  composeWithDevTools()
);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.REACT_APP_GRAPHQL_API_URI
})

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>
    </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
