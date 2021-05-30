import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useParams } from "react-router";
import { useAllUsersData, useVisitedStalls } from "../../hooks";
import PlatformVisitorCard from "./PlatformVisitorCard";

const PlatformChatUser = ({
  handleChatUserClick,
  setName,
  setEmail,
  setSelectedUser,
  selectedUser,
}) => {
  const { visitedStall } = useVisitedStalls();
  const { allUsersData } = useAllUsersData();
  const [stall, setStall] = useState([]);
  const [search, setSearch] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const arr = visitedStall;
    if (search) {
      const res = arr.filter(
        (stall) =>
          stall?.name?.toUpperCase().includes(search?.toUpperCase()) ||
          stall?.email?.toUpperCase().includes(search?.toUpperCase())
      );
      setStall(res);
    } else {
      arr.sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
      setStall(arr);
    }
    return () => {
      setStall([]);
    };
  }, [allUsersData, search, visitedStall]);

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
      {stall &&
        stall.map((item, i) => {
          const arr = allUsersData.filter((ele) => ele?.id === item?.id);
          const arr1 = allUsersData.filter((ele) => ele?.id === id);
          if (!selectedUser?.id && id) {
            setName(arr1[0]?.name || `Stall${i}`);
            setEmail(arr1[0]?.email);
            setSelectedUser(arr1[0]);
          }
          return (
            <div
              key={i}
              onClick={async () => {
                handleChatUserClick();
                setName(arr[0]?.name || `Stall${i}`);
                setEmail(arr[0]?.email);
                setSelectedUser(arr[0]);
              }}
            >
              <PlatformVisitorCard
                selectedUserUid={selectedUser?.id}
                visitorUid={item?.id}
                isStall={arr[0]?.id === arr[0]?.stallID}
                stallID={arr[0]?.stallID}
              />
            </div>
          );
        })}
    </div>
  );
};

export default PlatformChatUser;
