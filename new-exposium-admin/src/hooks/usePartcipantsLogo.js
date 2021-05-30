import { useEffect, useState } from "react";
import { database } from "../config";

const usePartcipantsLogo = () => {
  const [participantsLogo, setParticipantsLogo] = useState([]);
  useEffect(() => {
    database.ref(`Helpdesk/PartcipantsLogo/`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            ...obj[key],
          });
        setParticipantsLogo(arr);
      }
    });
    return () => {
      setParticipantsLogo([]);
    };
  }, []);
  return { participantsLogo };
};

export default usePartcipantsLogo;
