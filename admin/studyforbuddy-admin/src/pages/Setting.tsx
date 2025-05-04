import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useState } from 'react';
import { Button, Divider, IconButton, Switch } from '@mui/material';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Setting = () => {
  const [isDeleteExpanded, setIsDeleteExpanded] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Handle account deletion logic
  const handleDeleteAccount = () => {
    if (password === '') {
      alert('Please enter your password.');
      return;
    }
    // Logic for deleting the account
    alert('Account Deleted');
  };

  // Handle change password logic
  const handleChangePassword = () => {
    if (newPassword === '' || confirmPassword === '') {
      alert('Please fill out both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Logic for changing the password
    alert('Password changed successfully.');
  };

  // Handle notification preference changes
  const handleNotificationToggle = (type) => {
    if (type === 'email') {
      setEmailNotifications((prev) => !prev);
    } else if (type === 'sms') {
      setSmsNotifications((prev) => !prev);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Setting" />

      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Change Password Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Change Password</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ensure your account is secure by regularly updating your password.
            </p>
          </div>

          {/* Right Side: Expand Icon */}
          <IconButton onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}>
            {isPasswordExpanded ? <IoIosArrowUp className='text-gray-500 dark:text-white' /> : <IoIosArrowDown className='text-gray-500 dark:text-white' />}
          </IconButton>
        </div>

        {/* Expandable Content for Change Password */}
        {isPasswordExpanded && (
          <div className="w-full lg:w-[50%] mt-7 space-y-4">
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              className="w-full"
            >
              Change Password
            </Button>
          </div>
        )}

        {/* Divider */}
        <Divider sx={{ my: 4 }} className='dark:bg-[#ccc]' />

        {/* Notification Preferences Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Notification Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your notification preferences.
            </p>
          </div>

          {/* Right Side: Expand Icon */}
          <IconButton onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}>
            {isNotificationExpanded ? <IoIosArrowUp className='text-gray-500 dark:text-white' /> : <IoIosArrowDown className='text-gray-500 dark:text-white' />}
          </IconButton>
        </div>

        {/* Expandable Content for Notification Preferences */}
        {isNotificationExpanded && (
          <div className="w-full lg:w-[50%] mt-7 space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch
                checked={emailNotifications}
                onChange={() => handleNotificationToggle('email')}
                color="primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Switch
                checked={smsNotifications}
                onChange={() => handleNotificationToggle('sms')}
                color="primary"
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <Divider sx={{ my: 4 }} className='dark:bg-[#ccc]' />

        {/* Privacy Settings Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Privacy Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Control your privacy settings and data sharing preferences.
            </p>
          </div>

          {/* Right Side: Expand Icon */}
          <IconButton onClick={() => setIsPrivacyExpanded(!isPrivacyExpanded)}>
            {isPrivacyExpanded ? <IoIosArrowUp className='text-gray-500 dark:text-white' /> : <IoIosArrowDown className='text-gray-500 dark:text-white' />}
          </IconButton>
        </div>

        {/* Expandable Content for Privacy Settings */}
        {isPrivacyExpanded && (
          <div className="w-full lg:w-[50%] mt-7 space-y-4">
            <div className="flex items-center justify-between">
              <span>Share Data with Third Parties</span>
              <Switch color="primary" />
            </div>
            <div className="flex items-center justify-between">
              <span>Track Location</span>
              <Switch color="primary" />
            </div>
          </div>
        )}
        
        {/* Divider */}
        <Divider sx={{ my: 4 }} className='dark:bg-[#ccc]' />

        {/* Delete Account Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Delete Account</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Once you delete your account, you will lose all your data permanently. This action cannot be undone.
            </p>
          </div>

          {/* Right Side: Expand Icon */}
          <IconButton onClick={() => setIsDeleteExpanded(!isDeleteExpanded)}>
            {isDeleteExpanded ? <IoIosArrowUp className='text-gray-500 dark:text-white' /> : <IoIosArrowDown className='text-gray-500 dark:text-white' />}
          </IconButton>
        </div>

        {/* Expandable Content for Delete Account */}
        {isDeleteExpanded && (
          <div className="w-full lg:w-[50%] mt-7 space-y-4">
            <input
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              className="w-full"
            >
              Delete Account
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Setting;
