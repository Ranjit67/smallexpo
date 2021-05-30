import { useEffect, useState } from "react";
import { useCurrentUser } from ".";
import { database } from "../config";

const useLinks = () => {
  const { currentUserData } = useCurrentUser();
  const [links, setLinks] = useState([]);
  useEffect(() => {
    database
      .ref(`Users/${currentUserData?.stallID}/Links`)
      .on(`value`, (snap) => {
        const arr = [];
        let slno = 1;
        if (snap.exists()) {
          const obj = snap.val();
          for (const key in obj)
            arr.push({
              id: key,
              slno: slno++,
              ...obj[key],
            });
          setLinks(arr);
        }
      });
    return () => {
      setLinks([]);
    };
  }, [currentUserData?.stallID]);
  return { links };
};

export default useLinks;
