import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "./components";
import { database, useAuth } from "./config";
import { PrivateRoutes, PublicRoutes } from "./Routes";

const App = () => {
  const { currentUser } = useAuth();
  useEffect(() => {
    currentUser && database.ref(`Users/${currentUser?.uid}/isOnline`).set(true);
  }, [currentUser]);
  window.addEventListener("beforeunload", async (event) => {
    "uid" in currentUser &&
      (await database.ref(`Users/${currentUser?.uid}/isOnline`).set(false));
  });

  return (
    <ErrorBoundary FallbackComponent={<Loading />}>
      <BrowserRouter>
        {currentUser?.uid ? <PrivateRoutes /> : <PublicRoutes />}
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
