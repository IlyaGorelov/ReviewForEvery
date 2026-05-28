import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { deleteAnyAccountApi, deleteMeApi } from "../../Services/AuthService";
import { getUserByNameApi } from "../../Services/UserService";
import { UserGet } from "../../Models/User";

const AccountPage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { username: paramUsername } = useParams<{ username?: string }>();

  // Determine if we are viewing another user's profile
  const isForeign = Boolean(
    paramUsername && paramUsername !== authUser?.userName,
  );
  const [foreignUser, setForeignUser] = useState<UserGet | null>(null);

  // Fetch foreign user data if needed
  useEffect(() => {
    if (isForeign && paramUsername) {
      getUserByNameApi(paramUsername)
        .then((res) => {
          if (res?.data) setForeignUser(res.data);
        })
        .catch(() => toast.error("Could not load user data"));
    }
  }, [isForeign, paramUsername]);

  // Delete own account
  const handleDeleteMyAccount = async () => {
    if (
      window.confirm("Permanently delete your account? This cannot be undone.")
    ) {
      await deleteMeApi();
      logout();
      navigate("/register");
    }
  };

  // Delete any account (admin)
  const deleteAccount = async () => {
    const userId = window.prompt(
      "Enter the username of the account to delete:",
    );
    if (!userId) return;
    try {
      await deleteAnyAccountApi(String(userId));
      toast.success("Account deleted.");
    } catch {
      toast.error("Could not delete account.");
    }
  };

  const displayName = isForeign ? foreignUser?.username : authUser?.userName;

  if (isForeign && !foreignUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8 sm:p-10">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md">
                  {displayName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {displayName || "Unknown"}
                </h1>
                {!isForeign && authUser?.email && (
                  <p className="text-indigo-100 mt-1 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {authUser.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions – different for own vs foreign */}
          <div className="px-6 py-5 sm:p-8 grid gap-3">
            {isForeign ? (
              // Foreign user actions
              <>
                <button
                  onClick={() => navigate("all-reviews")}
                  className="w-full flex items-center justify-between px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    Reviews
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("top-lists")}
                  className="w-full flex items-center justify-between px-5 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Top Lists
                  </span>
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              // Own account actions
              <>
                <button
                  onClick={() => navigate("/my-reviews")}
                  className="w-full flex items-center justify-between px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    My Reviews
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/top-lists")}
                  className="w-full flex items-center justify-between px-5 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    My Top Lists
                  </span>
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteMyAccount}
                  className="w-full flex items-center justify-between px-5 py-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete My Account
                  </span>
                  <svg
                    className="w-5 h-5 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Admin Panel – only for own account if user has Admin role */}
        {!isForeign && authUser?.role?.includes("Admin") && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 sm:px-8">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Admin Panel
              </h2>
            </div>
            <div className="px-6 py-5 sm:p-8 grid gap-3">
              <button
                onClick={() => navigate("/reviews")}
                className="w-full flex items-center justify-between px-5 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition font-medium"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  All Reviews
                </span>
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("/add-film")}
                className="w-full flex items-center justify-between px-5 py-3 bg-violet-50 text-violet-700 rounded-xl hover:bg-violet-100 transition font-medium"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Movie
                </span>
                <svg
                  className="w-5 h-5 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("/add")}
                className="w-full flex items-center justify-between px-5 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition font-medium"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  All Movies List
                </span>
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={deleteAccount}
                className="w-full flex items-center justify-between px-5 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition font-medium"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Delete Any Account
                </span>
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {authUser?.role === "MainAdmin" && (
                <button
                  onClick={() => navigate("/register-admin")}
                  className="w-full flex items-center justify-between px-5 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Add Admin
                  </span>
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
