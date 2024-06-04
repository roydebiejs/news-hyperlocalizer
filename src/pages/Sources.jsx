/* eslint-disable react-hooks/exhaustive-deps */
import DemoDataPopup from "../components/DemoDataPopup.jsx";
import { useApi } from "../ApiContext.jsx";
import { useEffect, useState } from "react";
import SourcesTable from "../components/SourcesTable.jsx";

export default function Sources() {
  const { apiConnected } = useApi();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(apiConnected);
  }, [apiConnected]);

  return (
    <>
      {!isConnected && <DemoDataPopup />}
      <SourcesTable />
    </>
  );
}
