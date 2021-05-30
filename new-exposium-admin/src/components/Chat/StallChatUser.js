import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useAllUsersData, useVisitors } from "../../hooks";
import VisitorCard from "./VisitorCard";

const StallChatUser = ({
  handleChatUserClick,
  setName,
  setEmail,
  setSelectedUser,
  selectedUser,
}) => {
  const { allUsersData } = useAllUsersData();
  const { visitors } = useVisitors();
  const [visitorsData, setVisitorsData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const arr = visitors;
    if (search) {
      const res = arr.filter(
        (stall) =>
          stall?.name?.toUpperCase().includes(search?.toUpperCase()) ||
          stall?.email?.toUpperCase().includes(search?.toUpperCase())
      );
      setVisitorsData(res);
    } else {
      arr.sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
      setVisitorsData(arr);
    }

    return () => {
      setVisitorsData([]);
    };
  }, [allUsersData, search, visitors]);

  return (
    <div>
      <Paper
        component="form"
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <InputBase
          style={{
            paddingLeft: "2vw",
          }}
          placeholder="Search Stall"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <IconButton type="submit" color="primary">
          <Search />
        </IconButton>
      </Paper>
      {visitorsData &&
        visitorsData.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              handleChatUserClick();
              setName(item?.name || `Not Provided`);
              setEmail(item?.email);
              setSelectedUser(item);
            }}
          >
            <VisitorCard
              visitorUid={item?.id}
              selectedUserUid={selectedUser?.id}
            />
          </div>
        ))}
    </div>
  );
};

export default StallChatUser;
