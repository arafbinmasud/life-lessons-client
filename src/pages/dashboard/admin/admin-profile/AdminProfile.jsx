import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useRole from "../../../../hooks/useRole";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader";
import { FaEnvelope, FaUserEdit, FaUserShield } from "react-icons/fa";
import getErrorMessage from "../../../../utils/errorMessage";

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading, updateUser } = useAuth();
  const { role, loading: roleLoading } = useRole();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data) => {
    const updateInfo = {
      displayName: data.displayName,
      photoURL: data.photoURL,
    };

    try {
      await updateUser(updateInfo);

      const res = await axiosSecure.patch(
        `/users/update-profile?email=${user?.email}`,
        {
          name: data.displayName,
          photo: data.photoURL,
        },
      );

      if (!res.data.modifiedCount) {
        Swal.fire("No Changes", "Your profile was already up to date.", "info");
        return;
      }

      Swal.fire(
        "Success!",
        "Profile updated successfully. Please Reload",
        "success",
      );
      document.getElementById("update_modal").close();
    } catch (err) {
      console.error("Failed to update admin profile", err);
      Swal.fire("Update Failed", getErrorMessage(err), "error");
    }
  };

  if (loading || roleLoading) return <Loader />;

  return (
    <div className="space-y-12 p-2 md:p-6">
      <div className="border border-base-300 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 gap-8 items-center">
        {/* left side user info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="avatar relative">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={
                  user?.photoURL ||
                  "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww"
                }
                alt="Profile"
              />
            </div>
            {role === "admin" && (
              <span className="absolute bottom-0 right-0 badge badge-warning font-bold shadow-sm text-xs">
                Admin <FaUserShield />
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              {user?.displayName}
            </h2>
            <p className="text-accent flex items-center justify-center gap-2 mt-1">
              <FaEnvelope /> {user?.email}
            </p>
          </div>

          <button
            onClick={() => document.getElementById("update_modal").showModal()}
            className="btn btn-outline btn-xs gap-1"
            type="button"
          >
            <FaUserEdit /> Edit Profile
          </button>
        </div>
      </div>

      {/* update modal  */}
      <dialog id="update_modal" className="modal">
        <div className="modal-box w-full max-w-xl">
          <h3 className="font-bold text-xl mb-4">Update Profile</h3>

          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <fieldset className="fieldset space-y-3">
              <div>
                <label className="label font-bold mb-1 text-sm">
                  Author Name
                </label>
                <input
                  {...register("displayName", { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-bold mb-1 text-sm">
                  Author Photo URL
                </label>
                <input
                  {...register("photoURL", { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
            </fieldset>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                onClick={() => {
                  reset();
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

export default AdminProfile;
