import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useCurrentUser = () => {
  const [currentUserData, setcurrentUserData] = useState({});
  const [currentUserId, setCurrentUserId] = useState("");
  useEffect(() => {
    const ID = auth?.currentUser?.uid;
    database.ref(`Users/${ID}`).on(`value`, (snap) => {
      snap.exists() && setcurrentUserData(snap.val());
    });

    setCurrentUserId(ID);
    return () => {
      setcurrentUserData({});
      setCurrentUserId("");
    };
  }, []);

  return { currentUserData, currentUserId };
};

export default useCurrentUser;
