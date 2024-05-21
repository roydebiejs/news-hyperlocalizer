import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Story() {
  const id = window.location.pathname.split("/").pop();
  const [story, setStory] = useState({});
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("token");

  const getStory = useCallback(async () => {
    await axios
      .get(`${apiUrl}/api/stories/${id}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then(async function (response) {
        if (response.data) {
          setStory(response.data);
        } else {
          console.log("No story found");
        }
      })
      .catch(() => {
        console.log("Error on Authentication");
      });
  }, [apiUrl, authToken, id]);

  useEffect(() => {
    getStory();
  }, [getStory]);

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
