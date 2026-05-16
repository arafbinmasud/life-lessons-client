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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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
                <td>
                  {new Date(lesson.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
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
              {/* title  */}
              <label className="label font-bold">Lesson Title</label>
              <input
                {...register("title", { required: true })}
                type="text"
                className="input w-full"
                placeholder="e.g., The power of saying no"
              />
              {errors.title?.type === "required" && (
                <p className=" text-red-500">Title is required</p>
              )}

              {/* category and emotional tone  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* category  */}
                <div>
                  <label className="label font-bold mb-1">Category</label>
                  <select {...register("category")} className="select w-full">
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Career">Career</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Mistakes Learned">Mistakes Learned</option>
                  </select>
                </div>

                {/* tone  */}
                <div>
                  <label className="label font-bold mb-1">Emotional Tone</label>
                  <select {...register("tone")} className="select w-full">
                    <option value="Motivational">Motivational</option>
                    <option value="Sad">Sad</option>
                    <option value="Realization">Realization</option>
                    <option value="Gratitude">Gratitude</option>
                  </select>
                </div>
              </div>

              {/* author name n email   */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* name  */}
                <div>
                  <label className="label font-bold mb-1">Author Name</label>
                  <input
                    {...register("authorName")}
                    type="text"
                    readOnly
                    defaultValue={user?.displayName}
                    className="input w-full"
                  />
                </div>
                {/*email  */}
                <div>
                  <label className="label font-bold mb-1">Author Email</label>
                  <input
                    {...register("authorEmail")}
                    type="text"
                    readOnly
                    defaultValue={user?.email}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* image  */}
              <label className="label font-semibold">
                Image URL (Optional)
              </label>
              <input
                {...register("image")}
                type="text"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full"
              />

              {/* access level n privacy  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* access level */}
                <div>
                  <label className="label font-bold mb-1">Access Level</label>

                  <div
                    className={`${!isPremiumUser ? "tooltip w-full" : "w-full"}`}
                    data-tip={
                      !isPremiumUser
                        ? "Upgrade to Premium to create paid lessons"
                        : ""
                    }
                  >
                    <select
                      {...register("accessLevel")}
                      disabled={!isPremiumUser}
                      defaultValue="Free"
                      className={`select w-full ${!isPremiumUser ? "bg-gray-200" : ""}`}
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                {/* privacy */}
                <div>
                  <label className="label font-bold mb-1">Privacy</label>
                  <select {...register("privacy")} className="select w-full">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              {/* story  */}
              <label className="label font-bold">Story / Insight</label>
              <textarea
                {...register("description", { required: true })}
                type="text"
                rows={8}
                placeholder="Deep dive into your experience..."
                className="textarea w-full"
              />
              {errors.description?.type === "required" && (
                <p className="text-red-500">Story/Insight is required</p>
              )}
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
