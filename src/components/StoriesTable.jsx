/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { DemoStories } from "../data/DemoStories.js";
import { useApi } from "../ApiContext.jsx";

export default function StoriesTable() {
  const [stories, setStories] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [sources, setSources] = useState({});
  const [labels, setLabels] = useState({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { apiConnected } = useApi();
  const apiUrl = import.meta.env.VITE_API_URL;

  const authToken = localStorage.getItem("authToken");

  // Get initial page number from location state or default to 1
  const initialPage = location.state?.page || 1;
  const searchQuery = location.state?.search || "";
  useEffect(() => {
    setSearch(searchQuery);
  }, []);

  const [page, setPage] = useState(initialPage);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    setPage(initialPage);
    // Debounce search input
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 700);
  }, [search]);

  const getToken = useCallback(async () => {
    await axios
      .post(`${apiUrl}/api/token/`, {
        username: "api",
        password: "aP1",
      })
      .then(function (response) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/stories", {
          replace: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const getSource = useCallback(async (sourceId) => {
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
  }, []);

  const getLabel = useCallback(async (labelId) => {
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
      console.log("Error on Authentication");
      await getToken();
      navigate("/stories", {
        replace: true,
      });
      return "No label found";
    }
  }, []);

  const getStories = useCallback(async () => {
    const searchParam = debouncedSearch ? `&title=${debouncedSearch}` : "";
    await axios
      .get(`${apiUrl}/api/stories?page=${page}${searchParam}`, {
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
  }, [debouncedSearch, page]);

  useEffect(() => {
    if (!apiConnected) {
      setStories(DemoStories);
      setTotalResults(DemoStories.length);
      return;
    }
    getStories();
  }, [page, debouncedSearch, apiConnected]);

  const randomId = () => Math.random().toString(36).substr(2, 9);

  const totalPages = apiConnected ? Math.ceil(totalResults / 10) : 1;
  return (
    <>
      <div className="px-8 sm:px-12 lg:px-16">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Filter nieuws op naam:
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={search}
                  className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
                  placeholder=""
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div
                  className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-red-600"
                  aria-hidden="true"
                />
              </div>
            </div>
            <nav
              className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="flex flex-1 justify-between sm:justify-start">
                <button
                  className={`relative inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-red-900 focus-visible:outline-offset-0 text-white ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Terug
                </button>
                <button
                  className={`relative ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-red-900 focus-visible:outline-offset-0 text-white ${
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Volgende
                </button>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Pagina <span className="font-medium">{page}</span> van{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell"
                  >
                    Bron
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell"
                  >
                    Labels
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden xs:table-cell"
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
                            src={
                              story.image_url ? story.image_url : story.image
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-xs">
                      <div className="font-medium text-gray-900">
                        {story.title}
                      </div>
                      <div className="mt-1 text-gray-500 hidden md:block">
                        {story.summary}
                      </div>
                    </td>

                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-[15rem] hidden sm:table-cell">
                      <div className="font-medium text-gray-900">
                        {story.sourceName}
                      </div>
                      <div className="mt-1 text-gray-500 hidden 2xl:block">
                        {story.sourceWebsite}
                      </div>
                    </td>

                    <td className="whitespace-normal px-3 py-2.5 text-sm text-gray-500 max-w-[15rem] hidden lg:table-cell">
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
                    <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 hidden xs:table-cell">
                      {story.author}
                    </td>
                    <td className="relative whitespace-nowrap py-2.5 pl-3 text-left text-sm font-medium sm:pr-0">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/stories/${story.id}`, {
                            state: { page, search },
                          });
                        }}
                        className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
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
