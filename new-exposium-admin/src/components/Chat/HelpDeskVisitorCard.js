import { Avatar, Badge, CardHeader, Divider } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import { database } from "../../config";

const HelpDeskVisitorCard = ({ visitorUid, isSelected, setSelectedUser }) => {
  const isMounted = useRef(false);
  const [visitor, setVisitor] = useState({});
  const [unreadChats, setUnreadChats] = useState(0);
  useEffect(() => {
    isMounted.current = true;
    if (visitorUid) {
      database.ref(`Users/${visitorUid}`).on("value", (snap) => {
        if (snap.exists()) {
          isMounted.current && setVisitor({ id: visitorUid, ...snap.val() });
        }
      });
      database
        .ref(`Visitors/Helpdesk/${visitorUid}/unreadChats/byHelpDesk`)
        .on("value", (snap) => {
          if (snap.exists()) {
            isMounted.current && setUnreadChats(snap.val());
          } else {
            isMounted.current && setUnreadChats(0);
          }
        });
    }
    return () => (isMounted.current = false);
  }, [visitorUid]);
  return (
    <>
      <CardHeader
        style={{
          backgroundColor: isSelected && "#f6f6f6",
        }}
        onClick={() => {
          setSelectedUser(visitor);
          database
            .ref(`Visitors/Helpdesk/${visitorUid}/unreadChats/byHelpDesk`)
            .remove();
        }}
        avatar={
          <Badge color="secondary" badgeContent={unreadChats}>
            <Avatar
              alt={visitor?.email}
              src={visitor?.ProfilePic || visitor?.logoUrl}
            />
          </Badge>
        }
        title={visitor?.name}
        subheader={visitor?.email}
      />
      <Divider />
    </>
  );
};

export default HelpDeskVisitorCard;
