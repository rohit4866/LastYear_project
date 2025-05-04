import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import { FiEye } from "react-icons/fi";
import { FaRegAddressCard } from "react-icons/fa6";
import { PiStudentDuotone } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <FiEye size={24} className='text-primary dark:text-white' />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <FaRegAddressCard size={24} className='text-primary dark:text-white' />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <PiStudentDuotone size={24} className='text-primary dark:text-white' />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <FaUserTie size={24} className='text-primary dark:text-white' />
        </CardDataStats>
      </div>
    </>
  );
};

export default Dashboard;
