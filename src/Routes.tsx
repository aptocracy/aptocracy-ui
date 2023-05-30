import React from "react";
import { Route, Routes as Router } from "react-router";
import {
  BROWSE_ORGANIZATIONS,
  CREATE_ORGANIZATION,
  ORG_DETAILS,
  TREASURY_DETAILS,
} from "./common/constants/routes.constants";
import BrowseOrg from "./pages/BrowseOrg/BrowseOrg";
import CreateOrg from "./pages/CreateOrg/CreateOrg";
import OrgDetails from "./pages/OrgDetails/OrgDetails";
import TreasuryDetails from "./pages/TreasuryDetails/TreasuryDetails";

const Routes = () => {
  return (
    <Router>
      <Route element={<BrowseOrg />} path={BROWSE_ORGANIZATIONS} />
      <Route element={<CreateOrg />} path={CREATE_ORGANIZATION} />
      <Route element={<OrgDetails />} path={`${ORG_DETAILS}/:orgAddress`} />
      <Route
        element={<TreasuryDetails />}
        path={`${TREASURY_DETAILS}/:orgAddress/:treasuryIndex`}
      />
    </Router>
  );
};

export default Routes;
