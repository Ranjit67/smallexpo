import { Avatar, Badge, CardHeader, Divider } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import { database } from "../../config";
import { useCurrentUser } from "../../hooks";

const PlatformVisitorCard = ({
  selectedUserUid,
  visitorUid,
  isStall,
  stallID,
}) => {
  const isMounted = useRef(false);
  const [visitor, setVisitor] = useState({});
  const { currentUserId } = useCurrentUser();
  const [messageDetails, setMessageDetails] = useState(0);
  useEffect(() => {
    isMounted.current = true;
    if (visitorUid) {
      database.ref(`Users/${visitorUid}`).on("value", (snap) => {
        if (snap.exists()) {
          isMounted.current && setVisitor(snap.val());
        }
      });
      if (currentUserId && visitorUid) {
        const dbRef = `UnreadChats/byUser/${visitorUid}/${currentUserId}`;
        database.ref(dbRef).on("value", (snap) => {
          if (snap.exists()) {
            isMounted.current && setMessageDetails(snap.val());
          } else {
            isMounted.current && setMessageDetails(0);
          }
        });
      }
    }
    return () => (isMounted.current = false);
  }, [visitorUid, selectedUserUid, currentUserId]);

  return (
    <>
      <CardHeader
        style={{
          backgroundColor: selectedUserUid === visitorUid && "#f6f6f6",
        }}
        avatar={
          <Badge color="secondary" badgeContent={messageDetails}>
            <Avatar
              alt={visitor?.email}
              src={visitor?.ProfilePic || visitor?.logoUrl}
            />
          </Badge>
        }
        title={visitor?.name || visitor?.stallName || "Not Provided"}
        subheader={isStall ? "Booth Owner" : "Booth Member"}
        onClick={() => {
          const dbRef = `UnreadChats/byUser/${visitorUid}/${currentUserId}`;
          database.ref(dbRef).remove();
        }}
      />
      <Divider />
    </>
  );
};

export default PlatformVisitorCard;
