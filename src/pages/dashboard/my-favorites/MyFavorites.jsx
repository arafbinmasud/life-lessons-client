import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { Link } from "react-router";
import { FaTrashAlt, FaEye } from "react-icons/fa";

const MyFavorites = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["my-favorites", user?.email, category, tone],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-favorites?email=${user?.email}&category=${category}&tone=${tone}`,
      );
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Favorites Lessons</h1>
        <p className="text-accent text-sm">
          Manage all your saved life lessons in one place.
        </p>
      </div>
      {/* filter  */}
      <div className="flex flex-wrap gap-4 p-4 mb-5 rounded-xl border border-base-300">
        <div>
          <select
            value={category}
            className="select select-bordered select-sm md:select-md"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Personal Growth">Personal Growth</option>
            <option value="Career">Career</option>
            <option value="Relationships">Relationships</option>
            <option value="Mindset">Mindset</option>
            <option value="Mistakes Learned">Mistakes Learned</option>
          </select>
        </div>

        <div>
          <select
            value={tone}
            className="select select-bordered select-sm md:select-md"
            onChange={(e) => {
              setTone(e.target.value);
            }}
          >
            <option value="">All Tones</option>
            <option value="Motivational">Motivational</option>
            <option value="Sad">Sad</option>
            <option value="Realization">Realization</option>
            <option value="Gratitude">Gratitude</option>
          </select>
        </div>
      </div>

      {/* table  */}
      {favorites.length === 0 ? (
        <div className="text-center py-12 text-accent  rounded-xl">
          No favorite lessons found. Go browse and save some!
        </div>
      ) : (
        <div className="overflow-x-auto w-full rounded-xl border border-base-300">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>SL No</th>
                <th>Title</th>
                <th>Category</th>
                <th>Tone</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((lesson, index) => (
                <tr key={lesson._id}>
                  <td>{index + 1}</td>
                  <td className="font-semibold max-w-xs truncate">
                    {lesson.title}
                  </td>
                  <td>{lesson.category}</td>
                  <td>{lesson.tone}</td>
                  <td>{lesson.authorName}</td>
                  <td className="flex items-center gap-2">
                    <Link
                      to={`/lesson-details/${lesson._id}`}
                      className="btn btn-ghost text-primary tooltip"
                      data-tip="Details"
                    >
                      <FaEye />
                    </Link>

                    <button
                      className="btn btn-ghost text-error tooltip"
                      data-tip="Remove"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
