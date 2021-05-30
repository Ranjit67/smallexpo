import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Loading } from "../components";
import NotFound from "../pages/NotFound";

const PublicRoutes = () => {
  const LazyLeadPage = lazy(() => import("../pages/Public/LeadPage"));
  const LazyLogin = lazy(() => import("../pages/Public/Login"));
  const LazyRegister = lazy(() => import("../pages/Public/Register"));
  const LazyForgetPassword = lazy(() =>
    import("../pages/Public/ForgetPassword")
  );
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/" exact component={LazyLeadPage} />
        <Route path="/Login" exact component={LazyLogin} />
        <Route path="/Register" exact component={LazyRegister} />
        <Route path="/ForgetPassword" exact component={LazyForgetPassword} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default PublicRoutes;
