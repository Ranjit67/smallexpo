import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import { PrivateRouter } from ".";
import { Loading } from "../components";
import { useCurrentUser } from "../hooks";

const LazyDashboard = lazy(() => import("../pages/Admin/DashBoard"));
const LazyAdminProfile = lazy(() => import("../pages/Admin/EditProfile"));
const LazySupport = lazy(() => import("../pages/Admin/Support"));
const LazyUpdateEmail = lazy(() => import("../pages/Admin/UpdateEmail"));
const LazyPasswordSetting = lazy(() =>
  import("../pages/Admin/PasswordSetting")
);
const LazyExhibitors = lazy(() => import("../pages/Admin/Exhibitors"));
const LazyOnlineUsersData = lazy(() =>
  import("../pages/Admin/OnlineUsersData")
);
const LazyUsersData = lazy(() => import("../pages/Admin/UsersData"));
const LazyManageRole = lazy(() => import("../pages/Admin/ManageRole"));
const LazyAddAgenda = lazy(() => import("../pages/Admin/AddAgenda"));
const LazyViewAgenda = lazy(() => import("../pages/Admin/ViewAgenda"));
const LazyLiveChat = lazy(() => import("../pages/Admin/LiveChat"));
const LazyViewLogo = lazy(() => import("../pages/Admin/ViewLogo"));
const LazyLeadPageData = lazy(() => import("../pages/Admin/LeadPageData"));
const LazyAddEvent = lazy(() => import("../pages/Admin/AddEvent"));
const LazyViewEvents = lazy(() => import("../pages/Admin/ViewEvents"));

const LazyViewSpeaker = lazy(() => import("../pages/Admin/ViewSpeaker"));
const LazyEditAgenda = lazy(() => import("../pages/Admin/EditAgenda"));
const LazyChat = lazy(() => import("../pages/Admin/Chat"));
const LazyProductOrder = lazy(() => import("../pages/Admin/ProductOrder"));
const LazyAppointment = lazy(() => import("../pages/Admin/Appointment"));
const LazyViewVideo = lazy(() => import("../pages/Admin/ViewVideo"));
const LazyAddLink = lazy(() => import("../pages/Admin/AddLink"));
const LazyViewLinks = lazy(() => import("../pages/Admin/ViewLinks"));
const LazyAddDocument = lazy(() => import("../pages/Admin/AddDocument"));
const LazyViewDocuments = lazy(() => import("../pages/Admin/ViewDocuments"));
const LazyVisitors = lazy(() => import("../pages/Admin/Visitors"));
const LazyViewMember = lazy(() => import("../pages/Admin/ViewMember"));
const LazyAddMember = lazy(() => import("../pages/Admin/AddMember"));
const LazyUpdateStall = lazy(() => import("../pages/Admin/UpdateStall"));
const LazyStallDetails = lazy(() => import("../pages/Admin/StallDetails"));
const LazySpeakerRole = lazy(() => import("../pages/Admin/SpeakerRole"));
const LazyStallVideoCallRequest = lazy(() =>
  import("../pages/Admin/StallVideoCallRequestList")
);
const LazyStallVideoCall = lazy(() => import("../pages/Admin/StallVideoCall"));
const LazyAddProducts = lazy(() => import("../pages/Admin/Products"));
const LazyMeetingDetails = lazy(() => import("../pages/Admin/MeetingDetails"));
const LazyMeetingRoom = lazy(() => import("../pages/Admin/MeetingRoom"));
const LazyNotification = lazy(() =>
  import("../pages/Admin/SuperAdminNotification")
);
const LazyPoll = lazy(() => import("../pages/Admin/Poll"));
const LazySpeakerChat = lazy(() => import("../pages/Admin/SpeakerChat"));
const LazyAddSpeakerMember = lazy(() =>
  import("../pages/Admin/AddSpeakerMember")
);
const LazyViewSpeakerMember = lazy(() =>
  import("../pages/Admin/ViewSpeakerMember")
);
// const LazyUpdateEmail = lazy(() => import("../pages/Admin/UpdateEmail"));

//Platform
const LazyLandingPage = lazy(() => import("../pages/Platform/LandingPage"));
const LazyLobby = lazy(() => import("../pages/Platform/Lobby"));
const LazyViewProfile = lazy(() => import("../pages/Platform/ViewProfile"));
const LazyEditProfile = lazy(() => import("../pages/Platform/EditProfile"));
const LazyAllExhibitors = lazy(() => import("../pages/Platform/AllExhibitors"));
const LazyParticipants = lazy(() => import("../pages/Platform/Participants"));
const LazyHelpDesk = lazy(() => import("../pages/Platform/HelpDesk"));
const LazyAgenda = lazy(() => import("../pages/Platform/Agenda"));
const LazyMyBag = lazy(() => import("../pages/Platform/MyBag"));
const LazyProducts = lazy(() => import("../pages/Platform/Products"));
const LazyNetworking = lazy(() => import("../pages/Platform/Networking"));
const LazyAuditorium = lazy(() => import("../pages/Platform/Auditorium"));
const LazyPlatformLiveChat = lazy(() => import("../pages/Platform/LiveChat"));
const LazySetting = lazy(() => import("../pages/Platform/Setting"));
const LazyVideoCall = lazy(() => import("../pages/Platform/VideoCall"));
const LazyAuditoriumRoom = lazy(() =>
  import("../pages/Platform/AuditoriumRoom")
);
const LazyPlatformExhibitors = lazy(() =>
  import("../pages/Platform/Exhibitors")
);
const LazyCart = lazy(() => import("../pages/Platform/Cart"));
const LazyOrder = lazy(() => import("../pages/Platform/MyOrder"));
const LazyCheckout = lazy(() => import("../pages/Platform/CheckOutPage"));

const PrivateRoutes = () => {
  const { currentUserData } = useCurrentUser();
  return (
    <Suspense fallback={<Loading />}>
      {/* ***************************** => For All User Platform <= **************************************** */}
      <Switch>
        <PrivateRouter path="/" exact component={LazyLandingPage} />
        <PrivateRouter path="/Lobby" exact component={LazyLobby} />
        <PrivateRouter path="/ViewProfile" exact component={LazyViewProfile} />
        <PrivateRouter path="/EditProfile" exact component={LazyEditProfile} />

        <PrivateRouter
          path="/AllExhibitors"
          exact
          component={LazyAllExhibitors}
        />
        <PrivateRouter
          path="/Participants"
          exact
          component={LazyParticipants}
        />
        <PrivateRouter path="/HelpDesk" exact component={LazyHelpDesk} />
        <PrivateRouter path="/Agenda" exact component={LazyAgenda} />
        <PrivateRouter path="/MyBag" exact component={LazyMyBag} />
        <PrivateRouter path="/Shop" exact component={LazyProducts} />
        <PrivateRouter path="/Networking" exact component={LazyNetworking} />
        <PrivateRouter
          path="/PlatformExhibitors/:id"
          exact
          component={LazyPlatformExhibitors}
        />
        <PrivateRouter path="/Auditorium" exact component={LazyAuditorium} />
        <PrivateRouter
          path="/LiveChat"
          exact
          component={LazyPlatformLiveChat}
        />
        <PrivateRouter
          path="/LiveChat/:id"
          exact
          component={LazyPlatformLiveChat}
        />
        <PrivateRouter path="/Setting" exact component={LazySetting} />
        <PrivateRouter path="/VideoCall/:id" exact component={LazyVideoCall} />
        <PrivateRouter
          path="/AuditoriumRoom/:id"
          exact
          component={LazyAuditoriumRoom}
        />
        <PrivateRouter path="/Products" exact component={LazyCart} />
        <PrivateRouter path="/MyOrder" exact component={LazyOrder} />
        <PrivateRouter path="/Checkout" exact component={LazyCheckout} />
      </Switch>

      {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* ***************************** => For All Panelist <= ********************************************* */}

      {currentUserData?.role && (
        <Switch>
          <PrivateRouter path="/Dashboard" exact component={LazyDashboard} />
          <PrivateRouter path="/Support" exact component={LazySupport} />
          <PrivateRouter
            path="/UpdateEmail"
            exact
            component={LazyUpdateEmail}
          />
          <PrivateRouter
            path="/PasswordSetting"
            exact
            component={LazyPasswordSetting}
          />
        </Switch>
      )}

      {/* //////////////////////////////////////////////////////////////////////////////// */}

      {/* ****************************** =>  For SuperAdmin <= ************************** */}

      {currentUserData?.role === "superadmin" && (
        <Switch>
          <PrivateRouter path="/Exhibitors" exact component={LazyExhibitors} />
          <PrivateRouter
            path="/OnlineUsersData"
            exact
            component={LazyOnlineUsersData}
          />
          <PrivateRouter path="/UsersData" exact component={LazyUsersData} />
          <PrivateRouter
            path="/Notification"
            exact
            component={LazyNotification}
          />
          <PrivateRouter path="/ManageRole" exact component={LazyManageRole} />
          <PrivateRouter
            path="/ManageSpeakerRole"
            exact
            component={LazySpeakerRole}
          />
        </Switch>
      )}
      {/* //////////////////////////////////////////////////////////////////////////////// */}

      {/* ******************************* => For HelpDesk <= *************************** */}

      {currentUserData?.role === "helpdesk" && (
        <Switch>
          <PrivateRouter path="/AddAgenda" exact component={LazyAddAgenda} />
          <PrivateRouter path="/ViewAgenda" exact component={LazyViewAgenda} />
          <PrivateRouter
            path="/HelpDeskLiveChat"
            exact
            component={LazyLiveChat}
          />
          <PrivateRouter path="/ViewLogo" exact component={LazyViewLogo} />
          <PrivateRouter
            path="/LeadPageData"
            exact
            component={LazyLeadPageData}
          />
          <PrivateRouter path="/AddEvent" exact component={LazyAddEvent} />
          <PrivateRouter path="/ViewEvents" exact component={LazyViewEvents} />

          <PrivateRouter
            path="/ViewSpeaker"
            exact
            component={LazyViewSpeaker}
          />
          <PrivateRouter
            path="/EditAgenda/:id"
            exact
            component={LazyEditAgenda}
          />
        </Switch>
      )}

      {/* //////////////////////////////////////////////////////////////////////////////// */}

      {/* ***************************** => For Booth <= *********************************** */}

      {(currentUserData?.role === "stall" ||
        currentUserData?.role === "StallMember") && (
        <Switch>
          <PrivateRouter path="/Chat" exact component={LazyChat} />
          <PrivateRouter
            path="/Appointment"
            exact
            component={LazyAppointment}
          />
          <PrivateRouter path="/ViewVideo" exact component={LazyViewVideo} />
          <PrivateRouter path="/AddLink" exact component={LazyAddLink} />
          <PrivateRouter path="/ViewLinks" exact component={LazyViewLinks} />
          <PrivateRouter
            path="/AddDocument"
            exact
            component={LazyAddDocument}
          />
          <PrivateRouter
            path="/ViewDocuments"
            exact
            component={LazyViewDocuments}
          />
          <PrivateRouter path="/Visitors" exact component={LazyVisitors} />
          <PrivateRouter
            path="/Adminprofile"
            exact
            component={LazyAdminProfile}
          />
          <PrivateRouter
            path="/ProductOrder"
            exact
            component={LazyProductOrder}
          />
        </Switch>
      )}

      {/* *********************** => For Booth Owner Only <= ***************************** */}

      {currentUserData?.role === "stall" && (
        <Switch>
          <PrivateRouter path="/ViewMember" exact component={LazyViewMember} />
          <PrivateRouter path="/AddMember" exact component={LazyAddMember} />
          <PrivateRouter
            path="/UpdateStall"
            exact
            component={LazyUpdateStall}
          />
          <PrivateRouter
            path="/StallDetails"
            exact
            component={LazyStallDetails}
          />
          <PrivateRouter
            path="/StallVideoCall"
            exact
            component={LazyStallVideoCallRequest}
          />
          <PrivateRouter
            path="/StallVideoCall/:user"
            exact
            component={LazyStallVideoCall}
          />
          <PrivateRouter
            path="/AddProducts"
            exact
            component={LazyAddProducts}
          />
        </Switch>
      )}
      {/* //////////////////////////////////////////////////////////////////////////////// */}

      {/* ***************************** => For Speaker <= *********************************** */}

      {currentUserData?.role === "speaker" && (
        <Switch>
          <PrivateRouter
            path="/MeetingRoom"
            exact
            component={LazyMeetingRoom}
          />
          <PrivateRouter
            path="/SpeakerProfile"
            exact
            component={LazyAdminProfile}
          />
          <PrivateRouter
            path="/MeetingDetails"
            exact
            component={LazyMeetingDetails}
          />
          <PrivateRouter path="/Poll" exact component={LazyPoll} />
          <PrivateRouter
            path="/SpeakerChat"
            exact
            component={LazySpeakerChat}
          />
          <PrivateRouter
            path="/AddSpeakerMember"
            exact
            component={LazyAddSpeakerMember}
          />
          <PrivateRouter
            path="/ViewSpeakerMember"
            exact
            component={LazyViewSpeakerMember}
          />
        </Switch>
      )}
    </Suspense>
  );
};

export default PrivateRoutes;
