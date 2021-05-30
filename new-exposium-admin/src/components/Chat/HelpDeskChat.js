import { IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { database } from "../../config";
import { useHelpdesk } from "../../hooks";
import HelpDeskVisitorCard from "./HelpDeskVisitorCard";

const HelpDeskChat = ({
  handleChatUserClick,
  setName,
  setEmail,
  setSelectedUser,
  selectedUser,
}) => {
  const { helpDeskVisitors } = useHelpdesk();
  const [visitorsData, setVisitorsData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const arr = [];
    helpDeskVisitors.forEach((uid) => {
      database.ref(`Visitors/Helpdesk/${uid}/`).on("value", (snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.exists()) {
            arr.push(snapshot.val());
          }
        }
      });
    });
    const sortedArr = [...arr].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setVisitorsData(sortedArr);
    return () => setVisitorsData([]);
  }, [helpDeskVisitors, search]);
  return (
    <div>
      <Paper
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <IconButton>
          <Search />
        </IconButton>
        <InputBase
          placeholder="Search by visitors name or email"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </Paper>
      {visitorsData.length &&
        visitorsData.map((visitor, i) => (
          <div
            key={visitor?.visitorID}
            onClick={() => {
              handleChatUserClick();
              setName(selectedUser?.name || `Not Provided`);
              setEmail(selectedUser?.email);
            }}
          >
            <HelpDeskVisitorCard
              visitorUid={visitor?.visitorID}
              isSelected={visitor?.visitorID === selectedUser?.id}
              setSelectedUser={setSelectedUser}
            />
          </div>
        ))}
    </div>
  );
};

export default HelpDeskChat;
