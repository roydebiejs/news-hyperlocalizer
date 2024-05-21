import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function StoriesTable() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("token");

  const getToken = useCallback(async () => {
    await axios
      .post(`${apiUrl}/api/token/`, {
        username: "api",
        password: "aP1",
      })
      .then(function (response) {
        sessionStorage.setItem("token", response.data.token);
      });
  }, [apiUrl]);

  const getStories = useCallback(async () => {
    await axios
      .get(`${apiUrl}/api/stories?page=1`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then(async function (response) {
        if (response.data.results) {
          setStories(response.data.results);
        } else {
          console.log("No results found");
        }
      })
      .catch(async () => {
        console.log("Error on Authentication");
        await getToken();
        // reload component
        navigate("/stories", {
          replace: true,
        });
      });
  }, [apiUrl, authToken, getToken, navigate]);

  useEffect(() => {
    getStories();
  }, [getStories]);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Nieuwsitems
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Informatie over de laatste nieuwsitems.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Titel
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pr-4 text-left text-sm font-semibold text-gray-900"
                    >
                      Auteur
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stories.length ? (
                    stories.map((story) => (
                      <tr
                        key={story.id}
                        onClick={() => {
                          navigate(`/stories/${story.id}`);
                        }}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {story.title}
                        </td>
                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-gray-500">
                          {story.author}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!stories.length && (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        Geen nieuwsitems gevonden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
