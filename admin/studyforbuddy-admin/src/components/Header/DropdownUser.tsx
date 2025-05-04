import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { BiUser } from 'react-icons/bi';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import BASE_URL from '../../config';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [professor, setProfessor] = useState(null); // State to store professor data
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch professor data when component mounts
  useEffect(() => {
    const fetchProfessorData = async () => {
      const professorId = localStorage.getItem('professor_id'); // Get the professor ID from localStorage
      
      if (professorId) {
        try {
          const response = await fetch(`${BASE_URL}/professors/${professorId}`); // Use the professor ID in the fetch call
          const data = await response.json();
          setProfessor(data);
        } catch (error) {
          console.error('Error fetching professor data:', error);
        }
      }
    };

    fetchProfessorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('professor_id'); // Remove the professor_id from localStorage
    navigate('/auth/signin'); // Navigate to the SignIn page
  };

  // Default profile image URL
  const defaultProfileImage = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {professor ? professor.name : 'Loading...'} {/* Display professor's email */}
          </span>
          <span className="block text-xs">
            {professor ? professor.mobile : ''} {/* Display professor's mobile */}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img
            src={professor && professor.profile_image ? professor.profile_image : defaultProfileImage} // Use default image if null
            alt="User"
            className='rounded-full'
          />
        </span>

        <IoIosArrowDown />
      </Link>

      {/* Dropdown Start */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <BiUser className="right-4 top-4 text-[#B1B9C5] fill-current" size={22} />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/setting"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <IoSettingsOutline className="right-4 top-4 text-[#B1B9C5] fill-current" size={22} />
                Account Settings
              </Link>
            </li>
          </ul>
          <button 
            onClick={handleLogout} // Use handleLogout function
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <RiLogoutBoxLine className="right-4 top-4 text-[#B1B9C5] fill-current" size={22} />
            Log Out
          </button>
        </div>
      )}
      {/* Dropdown End */}
    </ClickOutside>
  );
};

export default DropdownUser;
