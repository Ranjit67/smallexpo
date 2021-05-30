import { useEffect, useState } from "react";
import { useCurrentUser } from ".";
import { database } from "../config";

const useVideo = () => {
  const { currentUserData } = useCurrentUser();

  const [video, setVideo] = useState([]);
  useEffect(() => {
    database
      .ref(`Users/${currentUserData?.stallID}/Video`)
      .on(`value`, (snap) => {
        if (snap.exists()) {
          const arr = [];
          let slno = 1;
          const obj = snap.val();
          for (const key in obj)
            arr.push({
              id: key,
              slno: slno++,
              ...obj[key],
            });
          setVideo(arr);
        }
      });
    return () => {
      setVideo([]);
    };
  }, [currentUserData?.stallID]);
  return { video };
};

export default useVideo;
