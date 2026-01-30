import { useState, useEffect, useRef } from "react";
import { createUser, updateUser, getUserById } from "../services/userService";
import { useNavigate, useParams } from "react-router";


function AddEditUser() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    status: "",
    profile: "",
    location: ""
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [existingProfileUrl, setExistingProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);




  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      getUserById(id).then(res => {
        const userData = res.data.users || res.data;
        setUser(userData);
        
        // Store existing profile URL separately
        if (userData.profile) {
          setExistingProfileUrl(userData.profile);
          setPreviewImage(userData.profile);
          
          // Extract file name from existing URL
          const pathParts = userData.profile.split('/');
          const existingFileName = pathParts[pathParts.length - 1];
          setFileName(existingFileName);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profile: file });
      setFileName(file.name);
      
      // Create preview for new file
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Reset to existing image if editing
    if (isEditing && existingProfileUrl) {
      setPreviewImage(existingProfileUrl);
      const pathParts = existingProfileUrl.split('/');
      setFileName(pathParts[pathParts.length - 1]);
      setUser({ ...user, profile: existingProfileUrl });
    } else {
      // For new user, clear everything
      setPreviewImage(null);
      setFileName("");
      setUser({ ...user, profile: "" });
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); // Start loading

  try {
    const formData = new FormData();

    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("gender", user.gender);
    formData.append("status", user.status);
    formData.append("location", user.location);

    // ONLY append if a new file is selected
    if (user.profile instanceof File) {
      formData.append("profile", user.profile);
    }
    // If editing and profile is existing URL, do NOT append it
    // Backend will keep existing profile if no new file is uploaded

    if (id) {
      await updateUser(id, formData);
      alert("User Updated Successfully");
    } else {
      await createUser(formData);
      alert("User Created Successfully");
    }

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setIsLoading(false); // Stop loading
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:py-12">
      <div className="max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-red from-gray-100 to-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 text-center">
              {isEditing ? "Edit User Details" : "Register Your Details"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-md"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
              
              {/* Show file name and remove button */}
              <div className="flex flex-col items-center gap-2 mt-2">
                {fileName && (
                  <>
                    <p className="text-sm text-gray-600 text-center">
                      {fileName.length > 25 ? fileName.substring(0, 25) + '...' : fileName}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Image
                    </button>
                  </>
                )}
              </div>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter FirstName"
                  onChange={handleChange}
                  value={user.firstName}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter LastName"
                  onChange={handleChange}
                  value={user.lastName}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  value={user.email}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter Mobile"
                  onChange={handleChange}
                  value={user.mobile}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Select Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Gender
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={user.gender === "Male"}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm sm:text-base text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={user.gender === "Female"}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm sm:text-base text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Select Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Status
                </label>
                <select
                  name="status"
                  value={user.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white text-sm sm:text-base"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Select Profile - File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Profile
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="profile-file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-file"
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-sm sm:text-base"
                  >
                    <span className="text-gray-500 truncate pr-2">
                      {fileName || "Choose file"}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0">
                      {fileName ? "✓ Selected" : "No file chosen"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Your Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Your Location"
                  onChange={handleChange}
                  value={user.location}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading} // disable while submitting
              className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 sm:py-3.5 lg:py-4 rounded-md transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base lg:text-lg
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Submitting..." : isEditing ? "Update User" : "Submit"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditUser;