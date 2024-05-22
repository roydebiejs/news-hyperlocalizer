import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StoriesTable() {
  const [stories, setStories] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("token");

  // Get initial page number from location state or default to 1
  const initialPage = location.state?.page || 1;
  const [page, setPage] = useState(initialPage);

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
      .get(`${apiUrl}/api/stories?page=${page}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then(function (response) {
        if (response.data.results) {
          setStories(response.data.results);
          setTotalResults(response.data.count); // Assuming the API response contains a count field
        } else {
          console.log("No results found");
        }
      })
      .catch(async () => {
        console.log("Error on Authentication");
        await getToken();
        navigate("/stories", {
          replace: true,
        });
      });
  }, [apiUrl, authToken, getToken, navigate, page]);

  useEffect(() => {
    getStories();
  }, [getStories, page]);

  const totalPages = Math.ceil(totalResults / 10);

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
                          navigate(`/stories/${story.id}`, {
                            state: { page },
                          });
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
                        Geen nieuwsitems gevonden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <nav
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{(page - 1) * 10 + 1}</span>{" "}
                    tot{" "}
                    <span className="font-medium">
                      {Math.min(page * 10, totalResults)}
                    </span>{" "}
                    van <span className="font-medium">{totalResults}</span>{" "}
                    resultaten
                  </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end">
                  <button
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Terug
                  </button>
                  <button
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Volgende
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
