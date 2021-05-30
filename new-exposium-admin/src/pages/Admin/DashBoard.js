import React from "react";

import { SpeakerDashBoard, StallDashboard, SuperAdminDashBoard } from ".";
import { Navigation } from "../../components";
import { useCurrentUser } from "../../hooks";

const Dashboard = () => {
  const { currentUserData } = useCurrentUser();
  return (
    <Navigation>
      {(currentUserData.role === "stall" ||
        currentUserData.role === "StallMember") && <StallDashboard />}
      {currentUserData.role === "superadmin" && <SuperAdminDashBoard />}
      {currentUserData.role === "helpdesk" && <SuperAdminDashBoard />}
      {currentUserData.role === "speaker" && <SpeakerDashBoard />}
    </Navigation>
  );
};

export default Dashboard;
