import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaBookmark,
  FaEdit,
  FaEye,
  FaGlobe,
  FaHeart,
  FaLock,
  FaTrash,
} from "react-icons/fa";
import Loader from "../../../components/Loader";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import LessonFormFields from "../../../components/LessonFormFields";
import { formatDateTime } from "../../../utils/formatDate";
import { confirmAction } from "../../../utils/confirmAction";

const MyLessons = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isPremiumUser, loading } = useRole();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const {
    data: lessons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-lessons", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons?email=${user?.email}`);
      return res.data;
    },
  });

  const handleDelete = (id) => {
    confirmAction({
      text: "You won't be able to revert this!",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/lessons/${id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Deleted!", "Your lesson has been deleted.", "success");
        }
      }
    });
  };

  const handleUpdate = (data) => {
    if (!isDirty) {
      Swal.fire({
        title: "No Changes Made",
        text: "You haven't changed anything!",
        icon: "info",
      });
      document.getElementById("update_modal").close();
      return;
    }
    axiosSecure
      .patch(`/lessons/${selectedLesson._id}`, data)
      .then((res) => {
        if (res.data.modifiedCount) {
          Swal.fire({
            title: "Updated!",
            text: "Your file has been updated.",
            icon: "success",
          });
          reset();
          refetch();
          setSelectedLesson(null);
          document.getElementById("update_modal").close();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading || loading) return <Loader />;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-5">My Lessons ({lessons.length})</h1>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Image & Title</th>
              <th>Stats</th>
              <th>Privacy</th>
              <th>Access Level</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, i) => (
              <tr
                key={lesson._id}
                className="hover:bg-base-100 transition-colors"
              >
                <td>{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        {lesson.image && (
                          <img src={lesson.image} alt="Lesson Photo" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{lesson.title}</div>
                      <span className="badge badge-sm badge-ghost">
                        {lesson.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />{" "}
                      {lesson.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBookmark className="text-yellow-500" />{" "}
                      {lesson.favorites?.length || 0}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="flex items-center gap-1">
                    {lesson.privacy === "Public" ? (
                      <FaGlobe className="text-secondary" />
                    ) : (
                      <FaLock className="text-secondary" />
                    )}{" "}
                    {lesson.privacy}
                  </span>
                </td>
                <td>
                  <span className="badge badge-secondary badge-sm">
                    {lesson.accessLevel}
                  </span>
                </td>
                <td>{formatDateTime(lesson.createdAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      to={`/lesson-details/${lesson._id}`}
                      className="btn btn-square btn-ghost btn-sm tooltip"
                      data-tip="Details"
                    >
                      <FaEye className="text-info text-lg" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        reset(lesson);
                        document.getElementById("update_modal").showModal();
                      }}
                      className="btn btn-square btn-ghost btn-sm tooltip"
                      data-tip="Edit"
                    >
                      <FaEdit className="text-warning text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson._id)}
                      className="btn btn-square btn-ghost btn-sm tooltip"
                      data-tip="Delete"
                    >
                      <FaTrash className="text-error text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal  */}
      <dialog id="update_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-3xl">
          <h3 className="font-bold text-xl mb-4">
            Update Lesson:{" "}
            <span className="text-secondary">{selectedLesson?.title}</span>
          </h3>

          <form onSubmit={handleSubmit(handleUpdate)}>
            <fieldset className="fieldset">
              <LessonFormFields
                register={register}
                errors={errors}
                isPremiumUser={isPremiumUser}
                user={user}
              />
            </fieldset>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                onClick={() => {
                  reset();
                  setSelectedLesson(null);
                  document.getElementById("update_modal").close();
                }}
                className="btn"
                type="button"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default MyLessons;
