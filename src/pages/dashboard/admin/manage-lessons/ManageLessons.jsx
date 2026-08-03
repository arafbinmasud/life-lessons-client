import {
  FaTrashAlt,
  FaStar,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaFlag,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader";
import Swal from "sweetalert2";
import ErrorState from "../../../../components/ErrorState";
import getErrorMessage from "../../../../utils/errorMessage";

const ManageLessons = () => {
  const axiosSecure = useAxiosSecure();

  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [isReported, setIsReported] = useState("");

  const {
    data: managementData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["manage-lessons", category, privacy, isReported],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/manage-lessons?category=${category}&privacy=${privacy}&isReported=${isReported}`,
      );
      return res.data;
    },
  });

  const { stats = {}, lessons = [] } = managementData;

  const handleUpdateStatus = async (id, updateBody, successMessage) => {
    try {
      const res = await axiosSecure.patch(
        `/admin/lessons/status/${id}`,
        updateBody,
      );
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire("Updated!", successMessage, "success");
        return;
      }
      Swal.fire("No Changes", "The lesson was not updated.", "warning");
    } catch (err) {
      console.error("Failed to update lesson status", err);
      Swal.fire("Update Failed", getErrorMessage(err), "error");
    }
  };

  const handleDeleteLesson = (id, title) => {
    Swal.fire({
      title: "Are you absolutely sure?",
      text: `"${title}" will be permanently removed from the platform.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/admin/lessons/${id}`)
          .then((res) => {
            if (!res.data.deletedCount) {
              Swal.fire(
                "Not Deleted",
                "The lesson could not be deleted. Please try again.",
                "warning",
              );
              return;
            }
            refetch();
            Swal.fire(
              "Deleted!",
              "The lesson has been permanently removed.",
              "success",
            );
          })
          .catch((err) => {
            console.error("Failed to delete lesson", err);
            Swal.fire("Delete Failed", getErrorMessage(err), "error");
          });
      }
    });
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Failed to load lessons"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* head  */}
      <div>
        <h1 className="text-4xl font-black">Manage Lessons</h1>
        <p className="text-accent mt-1">
          Review, feature, filter, and moderate all user-generated content.
        </p>
      </div>

      {/* stats  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Public Lessons
            </p>
            <h3 className="text-2xl font-black text-emerald-900">
              {stats?.publicCount}
            </h3>
          </div>
          <FaEye className="text-emerald-500 text-2xl" />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Private Lessons
            </p>
            <h3 className="text-2xl font-black text-gray-800">
              {stats?.privateCount}
            </h3>
          </div>
          <FaEyeSlash className="text-gray-400 text-2xl" />
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Flagged / Reported
            </p>
            <h3 className="text-2xl font-black text-red-900">
              {stats?.reportedCount}
            </h3>
          </div>
          <FaFlag className="text-red-500 text-2xl" />
        </div>
      </div>

      {/* filter section  */}
      <div className="p-4 rounded-2xl flex flex-wrap gap-4 items-center">
        <span className="text-sm font-bold text-neutral">Filter By:</span>

        {/* category filter  */}
        <select
          value={category}
          className="select select-bordered"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">All Categories</option>
          <option value="Personal Growth">Personal Growth</option>
          <option value="Career">Career</option>
          <option value="Relationships">Relationships</option>
          <option value="Mindset">Mindset</option>
          <option value="Mistakes Learned">Mistakes Learned</option>
        </select>

        {/* privacy */}
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Visibility</option>
          <option value="Public">Public Only</option>
          <option value="Private">Private Only</option>
        </select>

        {/* report filter */}
        <select
          value={isReported}
          onChange={(e) => setIsReported(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Content</option>
          <option value="true">Reported / Flagged</option>
        </select>

        {(category || privacy || isReported) && (
          <button
            onClick={() => {
              setCategory("");
              setPrivacy("");
              setIsReported("");
            }}
            className="btn btn-ghost text-error font-bold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {lessons.length > 1 ? (
        <p className="ml-3 font-semibold">
          Total ({lessons.length}) Lessons Found
        </p>
      ) : (
        <p className="ml-3 font-semibold">Total ({lessons.length}) Lesson Found</p>
      )}
      {/* main table  */}
      <div className="border border-base-300 rounded-2xl p-6 shadow-xs">
        {lessons.length === 0 ? (
          <p className="text-accent py-8 text-center text-sm">
            No lessons found matching the filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="uppercase text-accent">
                  <th>Lesson Details</th>
                  <th>Author</th>
                  <th>Visibility</th>
                  <th>Status/Flags</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson._id}>
                    <td>
                      <div className="max-w-xs md:max-w-sm">
                        <div className="font-bold text-base truncate">
                          {lesson.title}
                        </div>
                        <span className="badge badge-sm badge-outline mt-1">
                          {lesson.category}
                        </span>
                      </div>
                    </td>

                    <td className="text-sm">
                      <div className="font-medium">{lesson.authorName}</div>
                      <div className="text-xs text-accent">
                        {lesson.authorEmail}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge badge-sm font-bold ${lesson.privacy === "Public" ? "bg-primary text-white" : "badge-ghost border-base-300"}`}
                      >
                        {lesson.privacy}
                      </span>
                    </td>

                    <td className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {lesson.isFeatured && (
                          <span className="badge badge-warning text-xs font-bold">
                            ⭐ Featured
                          </span>
                        )}
                        {lesson.status === "Reviewed" && (
                          <span className="badge badge-info text-xs text-white font-bold">
                            ✓ Reviewed
                          </span>
                        )}
                        {lesson.isReported && (
                          <span className="badge badge-error text-xs text-white font-bold animate-pulse">
                            ⚠️ Flagged
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* featured btn  */}
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              lesson._id,
                              { isFeatured: !lesson.isFeatured },
                              lesson.isFeatured
                                ? "Removed from Featured List"
                                : "Marked as Featured Lesson",
                            )
                          }
                          className={`btn btn-square btn-sm ${lesson.isFeatured ? "btn-warning text-white" : "btn-outline btn-warning"}`}
                          title={
                            lesson.isFeatured
                              ? "Remove from featured list"
                              : "Make Lesson Featured"
                          }
                        >
                          <FaStar />
                        </button>

                        {/* marked reviewed btn*/}
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              lesson._id,
                              { status: "Reviewed" },
                              "Lesson Reviewed.",
                            )
                          }
                          disabled={lesson.status === "Reviewed"}
                          className="btn btn-square btn-sm btn-outline btn-info"
                          title="Mark as Reviewed"
                        >
                          <FaCheckCircle />
                        </button>

                        {/* dlt btn  */}
                        <button
                          onClick={() =>
                            handleDeleteLesson(lesson._id, lesson.title)
                          }
                          className="btn btn-square btn-sm btn-outline btn-error hover:text-white"
                          title="Delete Permanently"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
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

export default ManageLessons;
