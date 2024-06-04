/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  SpeakerWaveIcon,
  HeartIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "../ApiContext.jsx";
import { DemoStories } from "../data/DemoStories.js";

export default function Story() {
  const id = window.location.pathname.split("/").pop();
  const [story, setStory] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { apiConnected } = useApi();

  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = localStorage.getItem("authToken");

  const [source, setSource] = useState({});
  const [labels, setLabels] = useState([]);
  const [userNeeds, setUserNeeds] = useState([]);

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

          // check which user needsd is the highest, give that object a key of true
          const highestNeed = Math.max(
            response.data.needsKnow,
            response.data.needsUnderstand,
            response.data.needsFeel,
            response.data.needsDo
          );
          setUserNeeds([
            {
              name: "Know",
              stat: response.data.needsKnow,
              highestNeed: highestNeed === response.data.needsKnow,
            },
            {
              name: "Understand",
              stat: response.data.needsUnderstand,
              highestNeed: highestNeed === response.data.needsUnderstand,
            },
            {
              name: "Feel",
              stat: response.data.needsFeel,
              highestNeed: highestNeed === response.data.needsFeel,
            },
            {
              name: "Do",
              stat: response.data.needsDo,
              highestNeed: highestNeed === response.data.needsDo,
            },
          ]);
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
  }, []);

  useEffect(() => {
    if (!apiConnected) {
      const demoStory = DemoStories.find((story) => story.id == id);
      setStory(demoStory);
      const highestNeed = Math.max(
        demoStory.needsKnow,
        demoStory.needsUnderstand,
        demoStory.needsFeel,
        demoStory.needsDo
      );
      setUserNeeds([
        {
          name: "Know",
          stat: demoStory.needsKnow,
          highestNeed: highestNeed === demoStory.needsKnow,
        },
        {
          name: "Understand",
          stat: demoStory.needsUnderstand,
          highestNeed: highestNeed === demoStory.needsUnderstand,
        },
        {
          name: "Feel",
          stat: demoStory.needsFeel,
          highestNeed: highestNeed === demoStory.needsFeel,
        },
        {
          name: "Do",
          stat: demoStory.needsDo,
          highestNeed: highestNeed === demoStory.needsDo,
        },
      ]);
      console.log(demoStory);
      setSource({
        name: demoStory.sourceName,
        website: demoStory.sourceWebsite,
      });
      setLabels(demoStory.labels);
      return;
    }
    getStory();
  }, [apiConnected]);

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
                      <p>
                        {story.created
                          ? new Date(story.created).toLocaleString()
                          : ""}
                      </p>
                      <p>
                        {story.created ? timeDifference(story.created) : ""}
                      </p>
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Geüpdatet
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <p>
                        {story.updated
                          ? new Date(story.updated).toLocaleString()
                          : ""}
                      </p>
                      <p>
                        {story.updated ? timeDifference(story.updated) : ""}
                      </p>
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 py-1 lg:py-2 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Bron
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <Link
                        to={source.website}
                        className="text-red-600 hover:text-red-500"
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
                src={story.image_url ? story.image_url : story.image}
                alt=""
              />
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              User needs
            </h3>
            <dl className="mt-5 grid grid-cols-2 gap-5 xl:grid-cols-4">
              {userNeeds.map((item) => (
                <div
                  key={item.name}
                  className={`overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 ${
                    item.highestNeed ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  <dt className="truncate text-sm font-medium ">{item.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight">
                    {item.name === "Understand" ? (
                      <PresentationChartBarIcon className="h-6 w-6 inline-block mr-1" />
                    ) : null}
                    {item.name === "Know" ? (
                      <SpeakerWaveIcon className="h-6 w-6 inline-block mr-1" />
                    ) : null}
                    {item.name === "Feel" ? (
                      <HeartIcon className="h-6 w-6 inline-block mr-1" />
                    ) : null}
                    {item.name === "Do" ? (
                      <ShieldExclamationIcon className="h-6 w-6 inline-block mr-1" />
                    ) : null}
                    {Math.round((item.stat / story.needsSum) * 100)} %{" "}
                    <span className="text-base font-normal tracking-normal pl-5">
                      {item.stat}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="my-5">
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

          <p className="mt-5 text-sm leading-6 text-gray-700 2xl:w-3/4">
            {story.story}
          </p>
        </div>
      </div>
    </div>
  );
}

function timeDifference(storyUpdated) {
  const now = new Date();

  const updated = new Date(storyUpdated);

  const diff = now - updated;

  const diffInMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(diffInMinutes / (60 * 24));
  const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
  const minutes = diffInMinutes % 60;

  return `${days} dagen, ${hours} uur en ${minutes} minuten geleden`;
}
