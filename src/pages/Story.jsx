import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Story() {
  const id = window.location.pathname.split("/").pop();
  const [story, setStory] = useState({});
  const navigate = useNavigate();

  const getSources = async () => {
    await axios
      .get(import.meta.env.VITE_API_URL + "/api/stories/" + id, {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD,
        },
      })
      .then(async function (response) {
        setStory(response.data);
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
      <button
        type="button"
        className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {JSON.stringify(story)}
    </>
  );
}
