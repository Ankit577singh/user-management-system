import { useEffect, useState } from "react";
import { getUserById } from "../services/userService";
import { useParams, useNavigate } from "react-router";

function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserById(id).then(res => setUser(res.data.users));
  }, [id]);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-red-600 hover:text-red-700 flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to List</span>
        </button>

        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center">
            <div className="w-25 h-25 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
             
             <img className="w-24 h-24 rounded-full object-cover object-center" src={user.profile} alt=""/>
             
            </div>
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <span className="inline-block mt-2 px-4 py-1 bg-red-500 bg-opacity-20 rounded-full text-sm">
              {user.status || "Active"}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {[
              { icon: "📧", label: "Email", value: user.email },
              { icon: "📱", label: "Mobile", value: user.mobile },
              { icon: "⚧", label: "Gender", value: user.gender },
              { icon: "📍", label: "Location", value: user.location }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 flex gap-3">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;