import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

export const makeAuthValue = (overrides = {}) => ({
  user: null,
  loading: false,
  registerUser: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  googleSignIn: () => Promise.resolve(),
  loginUser: () => Promise.resolve(),
  logoutUser: () => Promise.resolve(),
  ...overrides,
});

export const renderWithProviders = (
  ui,
  { auth, route = "/", queryClient = createTestQueryClient() } = {},
) => {
  const Wrapper = ({ children }) => {
    const routed = <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
    const withAuth = auth ? (
      <AuthContext value={auth}>{routed}</AuthContext>
    ) : (
      routed
    );
    return (
      <QueryClientProvider client={queryClient}>{withAuth}</QueryClientProvider>
    );
  };

  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
};
