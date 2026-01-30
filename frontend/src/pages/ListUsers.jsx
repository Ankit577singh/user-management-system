import { useEffect, useState } from "react";
import { getUsers, deleteUser,exportUsersCSV } from "../services/userService";
import { useNavigate } from "react-router";

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const loadUsers = async () => {
  try {
    setLoading(true);              
    const res = await getUsers(currentPage);
    setUsers(res.data.users);
    setFilteredUsers(res.data.users);
  } catch (error) {
    console.log("API Error:", error);
  } finally {
    setLoading(false);            
  }
};


  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  //  search whenever searchTerm or users change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const firstName = (user.firstName || "").toLowerCase();
        const lastName = (user.lastName || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const mobile = (user.mobile || "").toLowerCase();
        const location = (user.location || "").toLowerCase();
        
        return (
          firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          email.includes(searchLower) ||
          mobile.includes(searchLower) ||
          location.includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);


  // export csv
  const handleExport = async () => {
  const res = await exportUsersCSV();

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    // This is now just a visual trigger, the actual search happens in useEffect
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-full md:max-w-6xl lg:max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full sm:flex-1 sm:max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, mobile, location..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchClick();
                    }
                  }}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={handleSearchClick}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate("/add")}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>+</span>
                <span>Add User</span>
              </button>
              <button onClick={handleExport} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap">
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Found {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        )}


        {/* No Results Message */}
       {!loading && filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No results for "${searchTerm}"` : "No users available"}
            </p>
          </div>
        )}

        {/* Desktop Table View - Hidden on Mobile */}
        {filteredUsers.length > 0 && (
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">ID</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">FullName</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">Email</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">Gender</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">Status</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">Profile</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u, index) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-700">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-700">{u.email}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-700">{u.gender || "M"}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className={`px-2 lg:px-3 py-1 text-white text-xs rounded-md ${
                          u.status === "Active" ? "bg-green-600" : "bg-red-600"
                        }`}>
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                          {u.profile ? (
                            <img
                              src={u.profile}
                              alt={`${u.firstName} ${u.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <svg
                            className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"
                            style={{ display: u.profile ? 'none' : 'block' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="relative dropdown-container">
                          <button
                            onClick={() => toggleDropdown(u._id)}
                            className="text-gray-600 hover:text-gray-900 text-xl font-bold"
                          >
                            ⋮
                          </button>
                          {openDropdown === u._id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <button
                                onClick={() => {
                                  navigate(`/view/${u._id}`);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <span>👁</span>
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/edit/${u._id}`);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <span>✏️</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(u._id);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <span>🗑</span>
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="flex items-center justify-end gap-2 px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm lg:text-base text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <button className="px-3 py-2 text-sm lg:text-base bg-red-600 text-white rounded-md min-w-[32px]">
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 text-sm lg:text-base text-gray-600 hover:text-gray-900"
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* Mobile Card View - Visible only on Mobile */}
        {filteredUsers.length > 0 && (
          <div className="md:hidden space-y-4">
            {filteredUsers.map((u, index) => (
              <div key={u._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                      {u.profile ? (
                        <img
                          src={u.profile}
                          alt={`${u.firstName} ${u.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <svg
                        className="w-7 h-7 text-blue-600"
                        style={{ display: u.profile ? 'none' : 'block' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {u.firstName} {u.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {index + 1}</p>
                    </div>
                  </div>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => toggleDropdown(u._id)}
                      className="text-gray-600 hover:text-gray-900 text-xl font-bold p-1"
                    >
                      ⋮
                    </button>
                    {openDropdown === u._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => {
                            navigate(`/view/${u._id}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span>👁</span>
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/edit/${u._id}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(u._id);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span>🗑</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-700 truncate ml-2">{u.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="text-gray-700">{u.gender || "M"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 text-white text-xs rounded-md ${
                      u.status === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}>
                      {u.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            <div className="flex items-center justify-center gap-3 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹ Prev
              </button>
              <span className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListUsers;