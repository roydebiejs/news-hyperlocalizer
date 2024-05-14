import React, { useEffect } from "react";
import axios from "axios";

import Nav from "../components/Nav";

export default function Home() {
  const getSources = async () => {
    await axios
      .get(import.meta.env.VITE_API_URL + "/api/sources/?page=2", {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD,
        },
      })
      .then(async function (response) {
        console.log("Authenticated");
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("Error on Authentication");
      });
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <>
      <Nav page={<p>Homepage</p>} />
    </>
  );
}
