/* eslint-disable react-hooks/exhaustive-deps */
import StoriesTable from "../components/StoriesTable";
import DemoDataPopup from "../components/DemoDataPopup";
import { useApi } from "../ApiContext.jsx";
import { useEffect, useState } from "react";

export default function Stories() {
  const { apiConnected } = useApi();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(apiConnected);
  }, [apiConnected]);

  return (
    <>
      {!isConnected && <DemoDataPopup />}
      <StoriesTable />
    </>
  );
}
