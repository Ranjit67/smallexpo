import { useEffect, useState } from "react";
import { database } from "../config";

const useLeadpageData = () => {
  const [leadPageData, setLeadPageData] = useState({});
  useEffect(() => {
    database.ref(`Helpdesk/LeadPageData/`).on(`value`, (snap) => {
      snap.exists() && setLeadPageData(snap.val());
    });
    return () => {
      setLeadPageData({});
    };
  }, []);
  return { leadPageData };
};

export default useLeadpageData;
