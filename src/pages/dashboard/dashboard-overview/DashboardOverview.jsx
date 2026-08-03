import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaBookmark, FaFolderPlus, FaHistory, FaPlus } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router";
import { formatDate } from "../../../utils/formatDate";

const DashboardOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard-stats?email=${user?.email}`,
      );
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const {
    totalCreated = 0,
    totalSaved = 0,
    recentLessons = [],
    chartData = [],
  } = stats;

  return (
    <div className="space-y-8">
      {/* top message  */}
      <div>
        <h1 className="text-4xl font-bold">
          Welcome Back, {user?.displayName}!
        </h1>
        <p className="text-accent text-sm">
          Here is your life lesson overview.
        </p>
      </div>

      {/* total lesson and saved  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left side lesson created */}
        <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
          <div className="p-4 bg-blue-500 text-white rounded-xl">
            <FaFolderPlus className="text-2xl" />
          </div>
          <div>
            <p className="text-accent text-sm font-medium">
              Total Lessons Created
            </p>
            <h3 className="text-3xl font-bold text-blue-600">{totalCreated}</h3>
          </div>
        </div>
        {/* lesson fav right side  */}
        <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 p-6 rounded-2xl shadow-sm">
          <div className="p-4 bg-orange-500 text-white rounded-xl">
            <FaBookmark className="text-2xl" />
          </div>
          <div>
            <p className="text-accent text-sm font-medium">
              Total Saved Lessons
            </p>
            <h3 className="text-3xl font-bold text-orange-600">{totalSaved}</h3>
          </div>
        </div>
      </div>

      {/* quick action btns  */}
      <div className="bg-green-50 border border-green-200 shadow-sm p-6 rounded-2xl">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            data-tip="Add Lesson"
            to="/dashboard/add-lesson"
            className="btn btn-primary btn-sm md:btn-md gap-2 tooltip"
          >
            <FaPlus />
          </Link>
          <Link
            to="/dashboard/my-lessons"
            className="btn btn-outline btn-sm md:btn-md"
          >
            All Lessons
          </Link>
          <Link
            to="/dashboard/my-favorites"
            className="btn btn-outline btn-warning btn-sm md:btn-md"
          >
            View Favorites
          </Link>
        </div>
      </div>

      {/* chart n recent lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* chart  */}
        <div className="lg:col-span-2 border border-base-300 p-6 rounded-2xl shadow-sm bg-base-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Contributions</h2>
            <p className="text-xs text-gray-400 mb-6">
              Lessons count per category
            </p>
          </div>

          {chartData.length === 0 ? (
            <p className="text-accent italic text-center py-20">
              No analytics data available.
            </p>
          ) : (
            <div className="w-full h-64 ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />

                  <Bar dataKey="count" fill="#93C957" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* recent lessons  */}
        <div className="border border-base-300 p-6 rounded-2xl shadow-sm space-y-4 bg-base-100">
          <div className="flex items-center gap-2 mb-2">
            <FaHistory className="text-gray-500" />
            <h2 className="text-lg font-bold">Recently Added Lessons</h2>
          </div>

          {recentLessons.length === 0 ? (
            <p className="text-accent italic py-4">
              You haven't shared any lessons yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex justify-between items-center border border-gray-300 p-4 rounded-2xl shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {lesson.category} • {formatDate(lesson.createdAt)}
                    </p>
                  </div>
                  <Link
                    to={`/lesson-details/${lesson._id}`}
                    className="btn btn-xs btn-ghost text-primary"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
