export const buildNewUser = ({ displayName, email, photoURL }) => ({
  displayName,
  email,
  photoURL,
  role: "user",
  isPremiumUser: false,
});

export const saveUser = (axios, user, token) =>
  axios.post("/users", user, {
    headers: { Authorization: `Bearer ${token}` },
  });
