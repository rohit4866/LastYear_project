import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import BASE_URL from '../../config';
import { Button } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

const defaultProfileImage = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/students`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  return (
    <div>
      <Breadcrumb pageName="Student List" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        
        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search classroom..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 pr-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto" style={{ tableLayout: 'auto' }}>
            {/* Table Header */}
            <thead className="bg-gray-2 dark:bg-meta-4">
              <tr>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base" style={{ width: '250px' }}>
                  Name
                </th>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Email</th>
                <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base">Mobile</th>
                <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
              {students.map((student, key) => (
                <tr
                  className={`${
                    key === students.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-strokedark'
                  }`}
                  key={student.id}
                >
                  {/* Name with Profile Image */}
                  <td className="flex items-center gap-3 p-2.5 xl:p-5" style={{ width: '250px', whiteSpace: 'nowrap' }}>
                    <div className="flex-shrink-0">
                      <img
                        src={student.profile_image || defaultProfileImage}
                        alt="Profile"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <p className="text-black dark:text-white">{student.name}</p>
                  </td>

                  {/* Email */}
                  <td className="p-2.5 xl:p-5 text-left">
                    <p className="text-black dark:text-white whitespace-nowrap">{student.email}</p>
                  </td>

                  {/* Mobile */}
                  <td className="p-2.5 xl:p-5 text-center">
                    <p className="text-meta-3">{student.mobile}</p>
                  </td>

                  {/* Action */}
                  <td className="p-2.5 xl:p-5 text-center">
                    <Button
                      variant="outlined"
                      color="#365E7D"
                      onClick={() => handleViewJob(student.id)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
