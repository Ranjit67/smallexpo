import { useEffect, useState } from "react";
import { useCurrentUser } from ".";
import { database } from "../config";

const useDocuments = () => {
  const { currentUserData } = useCurrentUser();
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    database
      .ref(`Users/${currentUserData?.stallID}/Documents`)
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
          setDocuments(arr);
        }
      });

    return () => {
      setDocuments([]);
    };
  }, [currentUserData?.stallID]);

  return { documents };
};

export default useDocuments;
