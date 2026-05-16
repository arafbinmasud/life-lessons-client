import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    staleTime: 0,
    queryFn: async () => {
      const result = await axiosSecure.get(`/users?email=${user?.email}`);
      return result.data;
    },
  });

  const role = userData?.role || "user";
  const isPremiumUser = userData?.isPremiumUser || false;
  const loading = isLoading || authLoading;
  return { role, isPremiumUser, loading };
};

export default useRole;
