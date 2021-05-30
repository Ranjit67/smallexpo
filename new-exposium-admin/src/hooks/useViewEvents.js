import { useEffect, useState } from "react";
import { database } from "../config";

const useViewEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  useEffect(() => {
    database.ref(`Helpdesk/Events`).on(`value`, (snap) => {
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
        setAllEvents(arr);
      }
    });
    return () => {
      setAllEvents([]);
    };
  }, []);
  return { allEvents };
};

export default useViewEvents;
