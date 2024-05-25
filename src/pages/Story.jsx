import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export default function Story() {
  const id = window.location.pathname.split("/").pop();
  const [story, setStory] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("token");

  const [source, setSource] = useState({});
  const [labels, setLabels] = useState([]);

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
          getSource(response.data.source);
          const labelIds = response.data.labels;
          for (const labelId of labelIds) {
            getLabel(labelId);
          }
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

  const getSource = useCallback(async (sourceId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/sources/${sourceId}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const name = response.data.name;
      const website = response.data.website;
      const medium = response.data.medium;
      setSource({ name, website, medium });
      return { name, website };
    } catch (error) {
      console.log("Error when fetching source");
      return "No source found";
    }
  }, []);

  const getLabel = useCallback(async (labelId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/labels/${labelId}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const labelName = response.data.name;
      const labelType = response.data.type;
      if (labels.find((label) => label.labelName === labelName)) {
        return;
      }
      setLabels((labels) => [...labels, { labelId, labelName, labelType }]);
    } catch (error) {
      console.log("Error when fetching label");
      return "No label found";
    }
  }, []);

  const randomId = () => Math.random().toString(36).substr(2, 9);

  return (
    <div className="px-8 sm:px-12 lg:px-16">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <button
            type="button"
            className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() =>
              navigate("/stories", {
                state: {
                  page: location.state.page,
                  search: location.state.search,
                },
              })
            }
          >
            Terug
          </button>
          <div className="block md:flex">
            <div className="xl:w-3/4 mt-5">
              <div className="sm:px-0">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  {story.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {story.summary}
                </p>
              </div>
              <div className="mt-2 w-full">
                <dl className="grid grid-cols-2">
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Aangemaakt
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <p>{new Date(story.created).toLocaleString()}</p>
                      <p>{timeDifference(story.created)}</p>
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Geüpdatet
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <p>{new Date(story.updated).toLocaleString()}</p>
                      <p>{timeDifference(story.updated)}</p>
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Bron
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <Link
                        to={source.website}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {source ? source.name : ""}
                      </Link>
                      <p>{source.medium}</p>
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Auteur
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {story.author}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="w-full sm:w-3/4 md:w-2/4 mt-4">
              <img
                className="w-full h-full object-cover rounded-md max-w-3xl"
                src={story.image}
                alt=""
              />
            </div>
          </div>
          <div className="my-4">
            {labels
              ? labels.map((label) => (
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
                ))
              : null}
          </div>
          <p className="mt-5 text-sm leading-6 text-gray-700 sm:mt-10 2xl:w-3/4">
            {story.story}
          </p>
        </div>
      </div>
    </div>
  );
}

function timeDifference(storyUpdated) {
  // Huidige datum en tijd
  const now = new Date();

  // Datum en tijd van story.updated
  const updated = new Date(storyUpdated);

  // Verschil in milliseconden
  const diff = now - updated;

  // Berekening van dagen, uren en minuten
  const diffInMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(diffInMinutes / (60 * 24));
  const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
  const minutes = diffInMinutes % 60;

  return `${days} dagen, ${hours} uur en ${minutes} minuten geleden`;
}
