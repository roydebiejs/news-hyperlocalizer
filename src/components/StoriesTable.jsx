import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoriesTable() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  const getStories = async () => {
    await axios
      .get(import.meta.env.VITE_API_URL + "/api/stories/?page=1", {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD,
        },
      })
      .then(async function (response) {
        setStories(response.data.results);
        console.log(response.data.results);
      })
      .catch(() => {
        console.log("Error on Authentication");
      });
  };

  useEffect(() => {
    getStories();
  }, []);
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
                  {stories &&
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
                    ))}
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
