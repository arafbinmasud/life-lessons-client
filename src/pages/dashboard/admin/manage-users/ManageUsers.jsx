import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loader from "../../../../components/Loader";
import { FaUserAlt, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading , refetch} = useQuery({
    queryKey: ["manage-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const handlePromoteAdmin = (user) => {
    console.log(user);
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to promote "${user.displayName}" to Admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make Admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/admin/users/role/${user._id}`, { role: "admin" , isPremiumUser: true})
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire(
                "Promoted!",
                `${user.displayName} is now an Admin.`,
                "success",
              );
            }
          })
          .catch((err) => console.error(err));
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 p-2 md:p-6 bg-base-100 rounded-3xl border border-base-300 shadow-xs">
      <div>
        <h1 className="text-4xl font-black">Manage Users</h1>
        <p className="text-accent mt-1">
          Total Registered Users:{" "}
          <span className="font-bold text-primary">{users.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center py-12 text-accent">No users found.</div>
        ) : (
          <table className="table table-zebra ">
            <thead>
              <tr className="text-sm uppercase bg-base-200">
                <th className="rounded-l-xl">Avatar & Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Lessons Created</th>
                <th className="text-center rounded-r-xl">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-circle w-10 h-10 ring-1 ring-base-300">
                          <img
                            src={
                              user.photoURL ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"
                            }
                            alt={user.name}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{user.displayName}</p>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    {user.role === "admin" ? (
                      <span className="badge badge-primary font-bold gap-1 py-3 text-xs">
                        <FaUserShield /> Admin
                      </span>
                    ) : (
                      <span className="badge badge-ghost font-semibold gap-1 py-3 text-xs border border-base-300">
                        <FaUserAlt className="text-gray-400" /> User
                      </span>
                    )}
                  </td>

                  <td className="text-center ">{user.totalLessons}</td>

                  <td className="text-center">
                    <button
                      onClick={() => handlePromoteAdmin(user)}
                      disabled={user.role === "admin"}
                      className="btn btn-square btn-sm tooltip"
                      data-tip="Promote to Admin"
                      type="button"
                    >
                      <FaUserShield className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
