import { useState, useRef } from 'react'
import { useAuth } from '../../auth/components/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
// import closeTenderModal from "../../features/tdp-lg/pages/TenderSearch";
import logo from '../../assets/wouessi-new-logo.png'
import defaultAvatar from '../../assets/default-avatar.jpg'
import { FaUser } from 'react-icons/fa'
import Icon from '../Icon/Icon'

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for file input
  const [profilePicture, setProfilePicture] = useState<string | null>(null) // Local image state
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setProfilePicture(reader.result as string) // Convert image to base64
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    // Reset the auth state to logged out.
    setAuth({
      isAuthenticated: false,
      user: {
        email: '',
        name: '',
      },
    })
    // Optionally remove the token if stored
    localStorage.removeItem('access_token')
    navigate('/')
  }

  // for picture insertion or deletion
  const triggerFileInput = () => fileInputRef.current?.click()
  const removeProfilePicture = () => setProfilePicture(null)

  return (
    <nav className="w-64 bg-gray-800 text-white p-8 space-y-4">
      <img
        src={logo}
        alt="Wouessi Logo"
        className="w-34 h-auto p-3 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="w-full h-0.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700"></div>
      <div className="flex flex-col justify-between h-[75vh]">
        <div>
          <ul className="space-y-3">
            <li>
              <Link to="/tenderdata" className="block p-3 nav-bg-color rounded">
                Tender Data
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  navigate('/lg')
                  setIsDropdownOpen((prev) => !prev)
                }}
                className="w-full text-left p-3 bg-gray-700 rounded flex justify-between"
              >
                Lead Generation
                <span>{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {/* Dropdown Appears Below "Lead Generation" */}
              {isDropdownOpen && (
                <ul className="ml-4 mt-2 bg-gray-700 rounded">
                  <li>
                    <Link
                      to="/lg/search-tender"
                      className="block p-3 hover:bg-gray-600 rounded"
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      Tender Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lg/ai-search-tender" // FOR FUTURE: edit to the actual path
                      className="block p-3 hover:bg-gray-600 rounded"
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      AI Tender Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lg/my_bids" // FOR FUTURE: edit to the actual path
                      className="block p-3 hover:bg-gray-600 rounded"
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      My Bids
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lg/my_tenders" // FOR FUTURE: edit to the actual path
                      className="block p-3 hover:bg-gray-600 rounded"
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      My Tenders
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/ca" className="block p-3 nav-bg-color rounded">
                Capability Assessment
              </Link>
            </li>
            <li>
              <Link to="/bm" className="block p-3 nav-bg-color rounded">
                Benchmarking
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 ">
          <div className="flex justify-right items-center">
            {/* User Profile Section */}
            {auth.isAuthenticated && (
              <>
                <div className="mt-6 p-3 bg-gray-700 rounded text-center mt-auto">
                  {/* Profile Picture Button */}
                  <button
                    onClick={() => {
                      setIsModalOpen(true)
                      // closeTenderModal; // had null here before
                    }}
                    className="block mx-auto"
                  >
                    <img
                      src={profilePicture || defaultAvatar} // Default avatar if no image
                      alt="User Profile"
                      className="w-16 h-16 rounded-full border-2 border-white object-cover"
                    />
                  </button>
                  {/* Username */}
                  <p className="mt-2">{auth.user.name || auth.user.email}</p>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout} // Call handleLogout when clicked
                  className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureUpload}
            />

            {/* Profile Picture Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                style={{ zIndex: 1001 }}
                onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
              >
                <div
                  className="bg-white p-5 rounded shadow-lg text-center"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  <h3 className="text-xl font-bold mb-3">Profile Picture</h3>

                  {/* Show current or default profile picture */}
                  <img
                    src={profilePicture || defaultAvatar}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mx-auto border border-gray-300 object-cover"
                  />

                  {/* Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={triggerFileInput}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Change Profile Picture
                    </button>
                    <button
                      onClick={removeProfilePicture}
                      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Remove Picture
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
