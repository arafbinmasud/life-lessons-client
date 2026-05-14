import { useForm } from "react-hook-form";
import useRole from "../../../hooks/useRole";

const AddLesson = () => {
  const { isPremiumUser, loading } = useRole();
  
  console.log("add theke", isPremiumUser, loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if(loading) {
    <span className="loading loading-spinner loading-lg"></span>
  }

  const handlePublishLesson = (data) => {
    console.log(data);
  };
  return (
    <div>
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
                  <select {...register("category")} className="select w-full">
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Career">Career</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Mistakes Learned">Mistakes Learned</option>
                  </select>
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
