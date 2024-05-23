import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export default function StoriesTable() {
  const [stories, setStories] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [sources, setSources] = useState({});
  const [labels, setLabels] = useState({});
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

  const getSource = useCallback(
    async (sourceId) => {
      if (sources[sourceId]) {
        return sources[sourceId]; // Return cached source if available
      }
      try {
        const response = await axios.get(`${apiUrl}/api/sources/${sourceId}`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const sourceName = response.data.name;
        const sourceWebsite = response.data.website;
        setSources((prevSources) => ({
          ...prevSources,
          [sourceId]: { sourceName, sourceWebsite },
        }));
        return { sourceName, sourceWebsite };
      } catch (error) {
        console.log("Error when fetching source");
        return "No source found";
      }
    },
    [apiUrl, authToken, sources]
  );

  const getLabel = useCallback(
    async (labelId) => {
      if (labels[labelId]) {
        return labels[labelId]; // Return cached label if available
      }
      try {
        const response = await axios.get(`${apiUrl}/api/labels/${labelId}`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const labelName = response.data.name;
        const labelType = response.data.type;
        setLabels((prevLabels) => ({
          ...prevLabels,
          [labelId]: { labelName, labelType },
        }));
        return { labelName, labelType };
      } catch (error) {
        console.log("Error when fetching label");
        return "No label found";
      }
    },
    [apiUrl, authToken, labels]
  );

  const getStories = useCallback(async () => {
    await axios
      .get(`${apiUrl}/api/stories?page=${page}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then(async function (response) {
        if (response.data.results) {
          const storiesWithSources = await Promise.all(
            response.data.results.map(async (story) => {
              const source = await getSource(story.source);
              return {
                ...story,
                sourceName: source.sourceName,
                sourceWebsite: source.sourceWebsite,
              };
            })
          );
          const storiesWithLabels = await Promise.all(
            storiesWithSources.map(async (story) => {
              const labels = await Promise.all(
                story.labels.map(async (labelId) => {
                  return getLabel(labelId);
                })
              );
              return {
                ...story,
                labels,
              };
            })
          );
          setStories(storiesWithLabels);
          setTotalResults(response.data.count);
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

  const randomId = () => Math.random().toString(36).substr(2, 9);

  const totalPages = Math.ceil(totalResults / 10);
  return (
    <>
      <div className="px-8 sm:px-12 lg:px-16">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <nav
              className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-4 py-3 sm:px-6"
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                    <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm sm:pl-0">
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
                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-xs">
                      <div className="font-medium text-gray-900">
                        {story.title}
                      </div>
                      <div className="mt-1 text-gray-500">{story.summary}</div>
                    </td>
                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-[15rem]">
                      <div className="font-medium text-gray-900">
                        {story.sourceName}
                      </div>
                      <div className="mt-1 text-gray-500">
                        {story.sourceWebsite}
                      </div>
                    </td>
                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-[15rem]">
                      {story.labels.map((label) => (
                        <span
                          key={label + randomId()}
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset mr-1 mb-1 ${
                            label.labelType == "LOCATION"
                              ? "bg-blue-100 text-blue-800 ring-blue-600/20"
                              : label.labelType == "AUDIENCE"
                              ? "bg-green-100 text-green-800 ring-green-600/20"
                              : label.labelType == "TOPIC"
                              ? "bg-yellow-100 text-yellow-800 ring-yellow-600/20"
                              : label.labelType == "CATEGORY"
                              ? "bg-purple-100 text-purple-800 ring-purple-600/20"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {label.labelType == "LOCATION" ? (
                            <MapPinIcon className="h-4 w-4 mr-1" />
                          ) : null}
                          {label.labelType == "AUDIENCE" ? (
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                          ) : null}
                          {label.labelType == "TOPIC" ? (
                            <TagIcon className="h-4 w-4 mr-1" />
                          ) : null}
                          {label.labelType == "CATEGORY" ? (
                            <ChartPieIcon className="h-4 w-4 mr-1" />
                          ) : null}
                          {label.labelName}
                        </span>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                      {story.author}
                    </td>
                    <td className="relative whitespace-nowrap py-2.5 pl-3 text-left text-sm font-medium sm:pr-0">
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
          </div>
        </div>
      </div>
    </>
  );
}
