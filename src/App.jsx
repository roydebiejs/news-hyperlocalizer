import axios from "axios";
import { useEffect, useState } from "react";

export default function App() {
  const [response, setResponse] = useState(null);
  const fetchData = async () => {
    const response = await axios.get(
      "http://localhost:8000/sources/api/sources/1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    console.log(response);
    setResponse(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <h1 className="text-3xl font-bold underline text-red-500">fdgdfgdgdfgd</h1>
  );
}
