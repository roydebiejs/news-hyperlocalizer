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

  // const getSource = async (source) => {
  //   await axios
  //     .get(`${apiUrl}/api/sources/${source}`, {
  //       headers: {
  //         Authorization: `Token ${authToken}`,
  //       },
  //     })
  //     .then(function (response) {
  //       if (response.data) {
  //         return response.data.name;
  //       }
  //       return "No source found";
  //     })
  //     .catch(async () => {
  //       console.log("Error when fetching source");
  //     });
  // };

  const totalPages = Math.ceil(totalResults / 10);
  return (
    <div className="px-8 sm:px-12 lg:px-16">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Nieuwsitem
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Bron
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Labels
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Auteur
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Bekijk</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stories.map((story) => (
                  <tr key={story.id} className="bg-gray-100">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            className="h-11 w-11 rounded-md object-cover"
                            src={story.image}
                            alt=""
                          />
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-normal px-3 py-5 text-sm text-gray-500 max-w-xs">
                      <div className="font-medium text-gray-900">
                        {story.title}
                      </div>
                      <div className="mt-1 text-gray-500">{story.summary}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{story.source}</div>
                      <div className="mt-1 text-gray-500">{story.url}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {story.labels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                        >
                          {label}
                        </span>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {story.author}
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 text-left text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => {
                          navigate(`/stories/${story.id}`, {
                            state: { page },
                          });
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Bekijk<span className="sr-only">, {story.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-gray-100 px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Pagina <span className="font-medium">{page}</span> van{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-indigo-900 focus-visible:outline-offset-0 text-white"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Terug
                </button>
                <button
                  className="relative ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-indigo-900 focus-visible:outline-offset-0 text-white"
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
  );
}
