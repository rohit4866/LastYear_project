import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.png';
import { RxDashboard } from "react-icons/rx";
import { SiGoogleclassroom } from "react-icons/si";
import { MdAddChart } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { RiFileUserLine } from "react-icons/ri";
import { GiDeadEye } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-12 mr-2" />
          <h1 className="text-lg font-bold text-[#ccc]">StudyForBuddy</h1>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>

            {/* <!-- Menu Item Dashboard --> */}
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dashboard') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  
                  <RxDashboard size={20} />
                  Dashboard
                </NavLink>
              </li>
            </ul>

            {/* <!-- Study material --> */}

            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              STUDY MATERIAL
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Profile --> */}
              <li>
                <NavLink
                  to="/studymaterial/classroom"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('classroom') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  
                  <SiGoogleclassroom size={20} />
                  Classroom
                </NavLink>
              </li>{/* <!-- Menu Item Profile --> */}
              <li>
                <NavLink
                  to="/studymaterial/classallocation"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('/studymaterial/classallocation') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <MdAddChart size={20}/>
                  Class Allocation
                </NavLink>
              </li>
            </ul>

            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              JOB
            </h3>
      
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
              <NavLink
                to="/job/placement"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes('/job') && 'bg-graydark dark:bg-meta-4'
                  // pathname.includes('/job/placement') || pathname.includes('/job/addjob') || pathname.includes('/job/viewjob') ? 'bg-graydark dark:bg-meta-4' : ''
                }`}
              >
                <RiFileUserLine size={20} />
                Placement
              </NavLink>
              </li>
            </ul>
            
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              STUDENT SECTION
            </h3>
      
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/studentsection/startupapplications"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('/studentsection/startupapplications') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GiDeadEye size={20}/>
                  Startup Applications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/studentsection/studentlist"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('/studentsection/studentlist') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiUser size={20}/>
                  Student List
                </NavLink>
              </li>
            </ul>

            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MORE
            </h3>
            
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Profile --> */}
              <li>
                <NavLink
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiUser size={20}/>
                  Profile
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/setting"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('setting') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <IoSettingsOutline size={20}/>
                  Setting
                </NavLink>
              </li>
            </ul>
          </div>

        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
