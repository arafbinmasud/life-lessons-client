import { act, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import AuthProvider from "./AuthProvider";
import useAuth from "../hooks/useAuth";

vi.mock("../firebase/firebase.config", () => ({
  auth: { currentUser: { uid: "current-user" } },
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider() {}),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve("registered")),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve("logged-in")),
  signInWithPopup: vi.fn(() => Promise.resolve("google-user")),
  signOut: vi.fn(() => Promise.resolve("logged-out")),
  updateProfile: vi.fn(() => Promise.resolve("updated")),
  onAuthStateChanged: vi.fn(),
}));

let authInfo;

const Consumer = () => {
  const value = useAuth();
  useEffect(() => {
    authInfo = value;
  }, [value]);
  return (
    <div>
      <span data-testid="loading">{String(value.loading)}</span>
      <span data-testid="user">{value.user?.email ?? "anonymous"}</span>
    </div>
  );
};

const renderProvider = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );

describe("AuthProvider", () => {
  let observer;
  const unsubscribe = vi.fn();

  beforeEach(() => {
    authInfo = undefined;
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      observer = cb;
      return unsubscribe;
    });
  });

  it("starts in a loading state with no user", () => {
    renderProvider();

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("anonymous");
  });

  it("publishes the signed-in user once firebase resolves the auth state", () => {
    renderProvider();

    act(() => observer({ email: "user@example.com" }));

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("user@example.com");
  });

  it("clears loading when firebase reports no signed-in user", () => {
    renderProvider();

    act(() => observer(null));

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("anonymous");
  });

  it("unsubscribes from auth state changes on unmount", () => {
    const { unmount } = renderProvider();

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("delegates registerUser to firebase", async () => {
    renderProvider();

    await expect(authInfo.registerUser("a@b.com", "secret")).resolves.toBe(
      "registered",
    );
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "a@b.com",
      "secret",
    );
  });

  it("delegates loginUser to firebase", async () => {
    renderProvider();

    await expect(authInfo.loginUser("a@b.com", "secret")).resolves.toBe(
      "logged-in",
    );
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "a@b.com",
      "secret",
    );
  });

  it("updates the profile of the currently signed-in firebase user", async () => {
    renderProvider();
    const updateInfo = { displayName: "Araf" };

    await expect(authInfo.updateUser(updateInfo)).resolves.toBe("updated");
    expect(updateProfile).toHaveBeenCalledWith(auth.currentUser, updateInfo);
  });

  it("signs in with a google popup", async () => {
    renderProvider();

    await expect(authInfo.googleSignIn()).resolves.toBe("google-user");
    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(Object));
  });

  it("signs the user out", async () => {
    renderProvider();

    await expect(authInfo.logoutUser()).resolves.toBe("logged-out");
    expect(signOut).toHaveBeenCalledWith(auth);
  });
});
