import { CATEGORY_OPTIONS, TONE_OPTIONS } from "../constants";

const LessonFormFields = ({ register, errors, isPremiumUser, user }) => (
  <>
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
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* tone  */}
      <div>
        <label className="label font-bold mb-1">Emotional Tone</label>
        <select {...register("tone")} className="select w-full">
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
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
    <label className="label font-semibold">Image URL (Optional)</label>
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
            !isPremiumUser ? "Upgrade to Premium to create paid lessons" : ""
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
  </>
);

export default LessonFormFields;
