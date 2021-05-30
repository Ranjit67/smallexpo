import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useHelpdesk = () => {
  const uid = auth?.currentUser?.uid;
  const [helpdeskVisitied, setHelpdeskVisitied] = useState([]);
  useEffect(() => {
    database.ref(`Visitors/Helpdesk`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj) arr.push(obj[key]?.visitorID);

        setHelpdeskVisitied(arr);
      }
    });
    return () => {
      setHelpdeskVisitied([]);
    };
  }, [uid]);
  return { helpdeskVisitied };
};

export default useHelpdesk;
