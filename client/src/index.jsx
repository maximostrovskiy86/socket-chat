import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/store";
import App from "./components/App";

ReactDOM.render(
  <Provider store={store.store}>
    <React.StrictMode>
      <PersistGate loading={null} persistor={store.persistor}>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
