import React from "react";
import { Redirect, Route } from "react-router-dom";

import { auth } from "../config";

const PrivateRouter = ({ component: Component, ...rest }) => {
  return (
    <div>
      <Route
        {...rest}
        render={(props) =>
          auth?.currentUser?.uid ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    </div>
  );
};

export default PrivateRouter;
