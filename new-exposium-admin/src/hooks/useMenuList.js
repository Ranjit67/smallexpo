import {
  AccountBox,
  AccountCircle,
  Add,
  AddShoppingCart,
  Assistant,
  Build,
  CameraEnhance,
  Chat,
  Dashboard,
  Description,
  Details,
  DirectionsWalk,
  Edit,
  EventNote,
  Group,
  GroupAdd,
  HeadsetMic,
  Link,
  LocalActivity,
  MeetingRoom,
  NoteAdd,
  Notifications,
  PersonAdd,
  Poll,
  RateReview,
  Settings,
  Storefront,
  SupervisedUserCircle,
  VideoCall,
  ViewAgenda,
  Visibility,
  YouTube,
} from "@material-ui/icons";
import { useEffect, useState } from "react";

const useMenuList = () => {
  const [menu, setMenu] = useState([]);

  const [setting, setSetting] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [openStore, setOpenStore] = useState(false);
  const [openLinks, setOpenLinks] = useState(false);
  const [openDocuments, setOpenDocuments] = useState(false);
  const [openAgenda, setOpenAgenda] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);

  const [manageRole, setManageRole] = useState(false);
  useEffect(() => {
    setMenu([
      //For All Dashboard
      {
        name: "Dashboard",
        route: "Dashboard",
        icon: <Dashboard color="primary" />,
        stall: true,
        StallMember: true,
        superadmin: true,
        helpdesk: true,
        speaker: true,
      },
      {
        name: "Chat",
        route: "Chat",
        icon: <Chat color="primary" />,
        stall: true,
        StallMember: true,
      },
      {
        name: "Appointment",
        route: "Appointment",
        icon: <EventNote color="primary" />,
        stall: true,
        StallMember: true,
      },
      {
        name: "Video Call",
        route: "StallVideoCall",
        icon: <VideoCall color="primary" />,
        stall: true,
        StallMember: false,
      },
      {
        name: "Visitors",
        route: "Visitors",
        icon: <DirectionsWalk color="primary" />,
        stall: true,
        StallMember: true,
      },
      {
        icon: <YouTube color="primary" />,
        name: "Promotion Video",
        route: "ViewVideo",
        stall: true,
        StallMember: true,
      },

      {
        icon: <AddShoppingCart color="primary" />,
        name: "Products",
        route: "AddProducts",
        stall: true,
        StallMember: false,
      },
      {
        icon: <Assistant color="primary" />,
        name: "Order",
        route: "ProductOrder",
        stall: true,
        StallMember: false,
      },
      {
        icon: <AccountCircle color="primary" />,
        name: "Edit Profile",
        route: "Adminprofile",
        stall: true,
        StallMember: true,
      },
      {
        icon: <GroupAdd color="primary" />,
        name: "Member Manage",
        collapsed: openMember,
        stall: true,
        StallMember: false,

        onClick: () => setOpenMember(!openMember),
        collapsedItems: [
          {
            name: "View Member",
            route: "ViewMember",
            icon: <Visibility color="action" />,
          },
          {
            name: "Add Member",
            route: "AddMember",
            icon: <PersonAdd color="action" />,
          },
        ],
      },
      {
        icon: <Storefront color="primary" />,
        name: "Booth",
        collapsed: openStore,
        stall: true,
        StallMember: false,

        onClick: () => setOpenStore(!openStore),
        collapsedItems: [
          {
            name: "Edit Booth ",
            route: "UpdateStall",
            icon: <Edit color="action" />,
          },
          {
            name: "Booth Details",
            route: "StallDetails",
            icon: <Storefront color="action" />,
          },
        ],
      },

      {
        icon: <Link color="primary" />,
        name: "Link",
        collapsed: openLinks,
        stall: true,
        StallMember: true,

        onClick: () => setOpenLinks(!openLinks),
        collapsedItems: [
          {
            name: "Add Link",
            route: "AddLink",
            icon: <Add color="action" />,
          },
          {
            name: "View Links",
            route: "ViewLinks",
            icon: <Visibility color="action" />,
          },
        ],
      },
      {
        icon: <Description color="primary" />,
        name: "Documents",
        collapsed: openDocuments,
        stall: true,
        StallMember: true,

        onClick: () => setOpenDocuments(!openDocuments),
        collapsedItems: [
          {
            name: "Add Document",
            route: "AddDocument",
            icon: <NoteAdd color="action" />,
          },
          {
            name: "View Documents",
            route: "ViewDocuments",
            icon: <Visibility color="action" />,
          },
        ],
      },
      //superAdmin DashBoard Menu
      {
        name: "Exhibitors",
        route: "Exhibitors",
        icon: <AccountBox color="primary" />,
        superadmin: true,
      },
      {
        name: "Notification",
        route: "Notification",
        icon: <Notifications color="primary" />,
        superadmin: true,
      },
      {
        name: "Users Data",
        route: "UsersData",
        icon: <Group color="primary" />,
        superadmin: true,
      },

      {
        name: "Online Users",
        route: "OnlineUsersData",
        icon: <SupervisedUserCircle color="primary" />,
        superadmin: true,
      },

      {
        icon: <Build color="primary" />,
        name: "Manage Role",
        collapsed: manageRole,
        superadmin: true,

        onClick: () => setManageRole(!manageRole),
        collapsedItems: [
          {
            name: "Add Stall",
            route: "ManageRole",
            icon: <Add color="action" />,
          },
          {
            name: "Add Speaker",
            route: "ManageSpeakerRole",
            icon: <Add color="action" />,
          },
          // {
          //   name: "Add HelpDesk",
          //   route: "AddHelpDesk",
          //   icon: <Add color="action" />,
          // },
        ],
      },
      //HelpDesk
      {
        name: "Live Chat",
        route: "HelpDeskLiveChat",
        icon: <Chat color="primary" />,
        helpdesk: true,
      },
      {
        name: "Lead Page Data",
        route: "LeadPageData",
        icon: <EventNote color="primary" />,
        helpdesk: true,
      },
      {
        name: "Participants Logo",
        route: "ViewLogo",
        icon: <CameraEnhance color="primary" />,
        helpdesk: true,
      },
      {
        icon: <ViewAgenda color="primary" />,
        name: "Manage Agenda",
        collapsed: openAgenda,
        helpdesk: true,

        onClick: () => setOpenAgenda(!openAgenda),
        collapsedItems: [
          {
            name: "Add Agenda",
            route: "AddAgenda",
            icon: <Add color="action" />,
          },
          {
            name: "View Agenda",
            route: "ViewAgenda",
            icon: <ViewAgenda color="action" />,
          },
        ],
      },

      {
        icon: <LocalActivity color="primary" />,
        name: "Manage Event",
        collapsed: openEvent,
        helpdesk: true,

        onClick: () => setOpenEvent(!openEvent),
        collapsedItems: [
          {
            name: "Add Event",
            route: "AddEvent",
            icon: <Add color="action" />,
          },
          {
            name: "View Events",
            route: "ViewEvents",
            icon: <RateReview color="action" />,
          },
        ],
      },
      //speaker
      {
        icon: <AccountCircle color="primary" />,
        name: "Edit Profile",
        route: "SpeakerProfile",
        speaker: true,
      },
      {
        icon: <Details color="primary" />,
        name: "Meeting Details",
        route: "MeetingDetails",
        speaker: true,
      },
      {
        icon: <MeetingRoom color="primary" />,
        name: "Meeting Room",
        route: "MeetingRoom",
        speaker: true,
      },
      {
        icon: <Poll color="primary" />,
        name: "Poll",
        route: "Poll",
        speaker: true,
      },
      {
        icon: <Chat color="primary" />,
        name: "Speaker Chat",
        route: "SpeakerChat",
        speaker: true,
      },

      //For All
      {
        name: "Support",
        route: "Support",
        icon: <HeadsetMic color="primary" />,
        stall: true,
        StallMember: true,
        helpdesk: true,
        speaker: true,
      },
      {
        icon: <PersonAdd color="primary" />,
        name: "Add member",
        collapsed: openMember,
        speaker: true,
        onClick: () => setOpenMember(!openMember),
        collapsedItems: [
          {
            name: "Add Member",
            route: "AddSpeakerMember",
            icon: <Add color="action" />,
          },
          {
            name: "View Member",
            route: "ViewSpeakerMember",
            icon: <Visibility color="action" />,
          },
        ],
      },

      {
        icon: <Settings color="primary" />,
        name: "Settings",
        collapsed: setting,
        stall: true,
        StallMember: true,
        superadmin: true,
        helpdesk: true,
        speaker: true,
        onClick: () => setSetting(!setting),
        collapsedItems: [
          {
            name: "Update Password",
            route: "PasswordSetting",
            icon: <Visibility color="action" />,
          },
          {
            name: "Update Email",
            route: "UpdateEmail",
            icon: <Edit color="action" />,
          },
        ],
      },
    ]);
    return () => {
      setMenu([]);
    };
  }, [
    manageRole,
    openAgenda,
    openDocuments,
    openEvent,
    openLinks,
    openMember,
    openStore,
    setting,
  ]);
  return { menu };
};

export default useMenuList;
