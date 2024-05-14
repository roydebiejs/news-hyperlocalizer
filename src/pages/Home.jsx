import { useEffect } from "react";
import axios from "axios";

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
      .catch(() => {
        console.log("Error on Authentication");
      });
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <>
      <p>Homepage</p>
    </>
  );
}
