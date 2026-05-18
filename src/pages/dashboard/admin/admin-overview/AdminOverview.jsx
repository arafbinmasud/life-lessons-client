import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loader from "../../../../components/Loader";
import {
  FaAward,
  FaBookOpen,
  FaCalendarDay,
  FaExclamationTriangle,
  FaUsers,
} from "react-icons/fa";

import { Link } from "react-router";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: overview = {}, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-overview");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const {
    totalUsers = 0,
    totalPublicLessons = 0,
    totalReportedLessons = 0,
    todayNewLessons = 0,
    mostActiveContributors = [],
  } = overview;

  return (
    <div className="space-y-8">
      {/* header  */}

      <h1 className="text-4xl font-black">Admin Overview</h1>

      {/* stats  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* users stat */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Total Users
            </p>
            <h3 className="text-3xl font-black text-blue-900">{totalUsers}</h3>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-xl shadow-md text-xl">
            <FaUsers />
          </div>
        </div>

        {/* lessons stat */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Public Lessons
            </p>
            <h3 className="text-3xl font-black text-emerald-900">
              {totalPublicLessons}
            </h3>
          </div>
          <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-md text-xl">
            <FaBookOpen />
          </div>
        </div>

        {/* report stat */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Reported Content
            </p>
            <h3 className="text-3xl font-black text-red-900">
              {totalReportedLessons}
            </h3>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-xl">
            <FaExclamationTriangle />
          </div>
        </div>

        {/* today lesson stat */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">
              Today's New Lessons
            </p>
            <h3 className="text-3xl font-black text-purple-900">
              {todayNewLessons}
            </h3>
          </div>
          <div className="bg-purple-500 text-white p-4 rounded-xl shadow-md text-xl">
            <FaCalendarDay />
          </div>
        </div>
      </div>

      {/* most active authors */}
      <div className="border border-base-300 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3">
          <FaAward className="text-warning text-xl" />
          <h2 className="text-xl font-bold">Most Active Contributors</h2>
        </div>

        {mostActiveContributors.length === 0 ? (
          <p className="text-accent py-4 text-center text-sm">
            No contributors data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="uppercase text-accent">
                  <th className="w-16">Rank</th>
                  <th>Contributor</th>
                  <th>Email</th>
                  <th className="text-center">Lessons Created</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {mostActiveContributors.map((contributor, index) => (
                  <tr key={contributor._id}>
                    <td className="font-bold text-neutral/70">#{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-circle w-10 h-10 ring-1 ring-base-300">
                            <img src={contributor.photo} alt="User" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{contributor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-accent text-sm">{contributor._id}</td>
                    <td className="text-center text-base">
                      {contributor.lessonCount}
                    </td>
                    <td className="text-center text-primary ">
                      <Link
                        to={`/author-lessons/${contributor.authorId}`}
                        className="link"
                      >
                        View All Lessons
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
