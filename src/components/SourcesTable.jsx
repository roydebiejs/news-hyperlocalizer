/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { truncateString } from "../data/functions.js";

export default function SourcesTable() {
  const [sources, setSources] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const authToken = localStorage.getItem("authToken");

  const initialPage = location.state?.page || 1;
  const searchQuery = location.state?.search || "";
  useEffect(() => {
    setSearch(searchQuery);
  }, []);

  const [page, setPage] = useState(initialPage);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    setPage(initialPage);
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
        navigate("/sources", {
          replace: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const getSources = useCallback(async () => {
    const searchParam = debouncedSearch ? `&name=${debouncedSearch}` : "";
    await axios
      .get(`${apiUrl}/api/sources?page=${page}${searchParam}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then(async function (response) {
        if (response.data.results) {
          setSources(response.data.results);
          setTotalResults(response.data.count);
        } else {
          console.log("No results found");
        }
      })
      .catch(async () => {
        console.log("Error on Authentication");
        await getToken();
        navigate("/sources", {
          replace: true,
        });
      });
  }, [debouncedSearch, page]);

  useEffect(() => {
    getSources();
  }, [page, debouncedSearch]);

  const handleScrape = async (sourceId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/collect_stories/`,
        { sourceid: sourceId },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        alert("Scraping started for source id: " + sourceId);
      }
    } catch (error) {
      console.error("Error starting scraping:", error);
    }
  };

  const totalPages = Math.ceil(totalResults / 10);
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
                Filter bronnen op naam:
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell"
                  >
                    Naam
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sources.length ? (
                  sources.map((source) => (
                    <tr key={source.id} className="bg-gray-100">
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 hidden sm:table-cell">
                        {source.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                        <Link
                          to={source.website}
                          className="text-red-600 hover:text-red-500"
                        >
                          {truncateString(source.website, 50)}
                        </Link>
                      </td>
                      <td className="relative whitespace-nowrap py-2.5 pl-3 text-left text-sm font-medium sm:pr-0">
                        <button
                          type="button"
                          onClick={() => handleScrape(source.id)}
                          className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Start scrape
                          <span className="sr-only">, {source.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      Geen resultaten gevonden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
