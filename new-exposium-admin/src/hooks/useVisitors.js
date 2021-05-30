import { useEffect, useState } from "react";
import { useCurrentUser } from ".";

import { database } from "../config";

const useVisitors = () => {
  const { currentUserData, currentUserId } = useCurrentUser();

  const [visitors, setVisitors] = useState([]);
  useEffect(() => {
    database
      .ref(`Visitors/Stall/${currentUserData?.stallID}/${currentUserId}`)
      .on(`value`, (snap) => {
        const arr = [];
        if (snap.exists()) {
          const obj = snap.val();
          for (const key in obj)
            arr.push({
              id: key,
              ...obj[key],
            });

          setVisitors(arr);
        }
      });
    return () => {
      setVisitors([]);
    };
  }, [currentUserData?.stallID, currentUserId]);
  return { visitors };
};

export default useVisitors;
