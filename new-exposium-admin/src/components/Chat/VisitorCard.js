import React, { useEffect, useRef, useState } from "react";
import { Avatar, Badge, CardHeader, Divider } from "@material-ui/core";
import { database } from "../../config";
import { useCurrentUser } from "../../hooks";

const VisitorCard = ({ visitorUid, selectedUserUid }) => {
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
      if (currentUserId) {
        const dbRef = `UnreadChats/byStall/${visitorUid}/${currentUserId}`;
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
  }, [visitorUid, currentUserId]);
  return (
    <>
      <CardHeader
        style={{
          backgroundColor: selectedUserUid === visitorUid && "#f6f6f6",
        }}
        avatar={
          <Badge color="secondary" badgeContent={messageDetails}>
            <Avatar alt={visitor?.email} src={visitor?.ProfilePic} />
          </Badge>
        }
        title={visitor?.name || `Not Provided`}
        subheader={visitor?.email}
        onClick={() => {
          const dbRef = `UnreadChats/byStall/${visitorUid}/${currentUserId}`;
          database.ref(dbRef).remove();
        }}
      />
      <Divider />
    </>
  );
};

export default VisitorCard;

/** @ Note
 * Visitor Details properly fetch from database
 * Selected user is highlighted in the ui
 * User once change their details will show immediately in ui
 * */
