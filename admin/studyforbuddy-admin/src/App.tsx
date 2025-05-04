import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import Classroom from './pages/StudyMaterial/Classroom';
import NewClassroom from './pages/StudyMaterial/NewClassroom';
import Classallocation from './pages/StudyMaterial/Classallocation';
import Placement from './pages/Job/Placement';
import Addjob from './pages/Job/Addjob';
import StartupApplications from './pages/StudentSection/StartupApplications';
import Setting from './pages/Setting';
import Showclassroom from './pages/StudyMaterial/showclassroom';
import Viewjob from './pages/Job/viewjob';
import Editjob from './pages/Job/Editjob';
import StudentList from './pages/StudentSection/StudentList';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  // Redirect based on the presence of professor_id
  useEffect(() => {
    const professor_id = localStorage.getItem('professor_id');
    
    // If professor_id exists and user is on sign-in or sign-up, redirect to dashboard
    if (professor_id && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      window.location.href = '/dashboard';
    }

    // If no professor_id and user is trying to access dashboard or other protected routes, redirect to signin
    if (!professor_id && pathname.startsWith('/dashboard')) {
      window.location.href = '/auth/signin';
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Protected Route Wrapper
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const professor_id = localStorage.getItem('professor_id');
    return professor_id ? element : <Navigate to="/auth/signin" />;
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Default route to redirect to SignIn */}
      <Route path="/" element={<Navigate to="/auth/signin" />} />

      {/* Authentication Pages */}
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin | StudyForBuddy" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | StudyForBuddy" />
            <SignUp />
          </>
        }
      />

      {/* Protected Routes */}
      <Route element={<DefaultLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Dashboard" />
                  <Dashboard />
                </>
              }
            />
          }
        />
        <Route
          path="/studymaterial/classroom"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Classroom" />
                  <Classroom />
                </>
              }
            />
          }
        />
        <Route
          path="/studymaterial/newclassroom"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="New Classroom" />
                  <NewClassroom />
                </>
              }
            />
          }
        />
        <Route
          path="/studymaterial/showclassroom/:classroomId"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Show Classroom" />
                  <Showclassroom />
                </>
              }
            />
          }
        />
        <Route
          path="/studymaterial/classallocation"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Class Allocation" />
                  <Classallocation />
                </>
              }
            />
          }
        />
        <Route
          path="/job/placement"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Placements" />
                  <Placement />
                </>
              }
            />
          }
        />
        <Route
          path="/job/addjob"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Add Job" />
                  <Addjob />
                </>
              }
            />
          }
        />
        <Route
          path="/job/viewjob/:jobId"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="View Job" />
                  <Viewjob />
                </>
              }
            />
          }
        />
        <Route
          path="/job/editjob/:jobId"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="View Job" />
                  <Editjob />
                </>
              }
            />
          }
        />
        <Route
          path="/studentsection/startupapplications"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Startup Applications" />
                  <StartupApplications />
                </>
              }
            />
          }
        />
        <Route
          path="/studentsection/studentlist"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Student List" />
                  <StudentList />
                </>
              }
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Profile" />
                  <Profile />
                </>
              }
            />
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute
              element={
                <>
                  <PageTitle title="Setting" />
                  <Setting />
                </>
              }
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
