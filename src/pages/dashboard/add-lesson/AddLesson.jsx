import { useForm } from "react-hook-form";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import successAnimation from "../../../assets/Success.json";
import Lottie from "lottie-react";
import Loader from "../../../components/Loader";

const AddLesson = () => {
  const { isPremiumUser, loading } = useRole();
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  if (loading) {
    return <Loader />;
  }

  const handlePublishLesson = (data) => {
    data.isFeatured = false;

    axiosSecure
      .post("/lessons", data)
      .then((res) => {
        if (res.data.insertedId) {
          setShowSuccess(true);
          reset();

          setTimeout(() => {
            setShowSuccess(false);
          }, 4000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="relative">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center">
            <Lottie.default
              animationData={successAnimation}
              loop={false}
              className="w-64 h-64"
            />
            <h2 className="text-2xl font-bold text-green-600 mt-4">
              Lesson Published!
            </h2>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-5">
        Share A Life Lesson
      </h1>
      <div className="card bg-base-100 w-full max-w-6xl mx-auto shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(handlePublishLesson)}>
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

              <button className="btn btn-neutral mt-4">Publish Lesson</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
