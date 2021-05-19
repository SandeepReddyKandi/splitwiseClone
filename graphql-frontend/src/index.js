import React from "react";
import {createStore} from "redux";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {Provider} from "react-redux";
import rootReducer from "./reducers/rootReducer";
import {composeWithDevTools} from "redux-devtools-extension";

const store = createStore(
  rootReducer,
  composeWithDevTools()
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
