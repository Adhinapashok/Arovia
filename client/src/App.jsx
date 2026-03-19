import { Route, Routes } from 'react-router-dom'
import './App.jsx'
import AddDoctor from './Components/Admin/AddDoctor.jsx'
import AddStaff from './Components/Admin/AddStaff.jsx'
import AddStock from './Components/Admin/AddStock.jsx'
import EditDoctor from './Components/Admin/EditDoctor.jsx'
import EditStaff from './Components/Admin/EditStaff'
import ViewBooking from './Components/Admin/ViewBooking.jsx'
import ViewDoctor from './Components/Admin/ViewDoctor.jsx'
import ViewMedicine from './Components/Admin/ViewMedicine.jsx'
import ViewPrescription from './Components/Admin/ViewPrescription.jsx'
import Login from './Components/Login.jsx'
import AdminHome from './Components/Admin/AdminHome.jsx'
import AddMedicine from './Components/Admin/AddMedicine.jsx'
import EditMedicine from './Components/Admin/EditMedicine.jsx'
import ViewStaff from './Components/Admin/ViewStaff.jsx'
import AdminChangePassword from './Components/Admin/AdminChangePassword.jsx'
import ViewSchedule from './Components/Admin/ViewSchedule.jsx'
import ViewProfile from './Components/Doctor/ViewProfile.jsx'
import ViewFeedback from './Components/Admin/ViewFeedback.jsx'
import AddSchedule from './Components/Doctor/AddSchedule.jsx'
import EditSchedule from './Components/Doctor/EditSchedule.jsx'
import ViewdrSchedule from './Components/Doctor/ViewdrSchedule.jsx'
import ViewdrBooking from './Components/Doctor/ViewdrBooking.jsx'
import AddPrescription from './Components/Doctor/AddPrescription.jsx'
import SignUp from './Components/User/SignUp.jsx'
import EditProfile from './Components/User/EditProfile.jsx'
import DoctorHome from './Components/Doctor/DoctorHome.jsx'
import DoctorChangePassword from './Components/Doctor/DoctorChangePassword.jsx'
import UserHome from './Components/User/UserHome.jsx'
import UserChangePassword from './Components/User/UserChangePassword.jsx'
import UserProfile from './Components/User/ViewuserProfile.jsx'
import ViewDoctors from './Components/User/ViewDoctors.jsx'
import ViewBookings from './Components/User/ViewBooking.jsx'
import ViewPrescriptions from './Components/User/ViewPrescription.jsx'
import ViewuserSchedule from './Components/User/ViewuserSchedule.jsx'

function App() {
  return (
    <>
      <div style={{ padding: '0', margin: '0', boxSizing: 'border-box' }}>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          {/* Admin Routes - Using /* to catch all admin subroutes */}
          <Route path='/home' element={<AdminHome />}>
            <Route index element={<AdminHome />} />
            <Route path='adddr' element={<AddDoctor />} />
            <Route path='editdr' element={<EditDoctor />} />
            <Route path='viewdr' element={<ViewDoctor />} />
            <Route path='addmed' element={<AddMedicine />} />
            <Route path='editmed' element={<EditMedicine />} />
            <Route path='viewmed' element={<ViewMedicine />} />
            <Route path='addstf' element={<AddStaff />} />
            <Route path='editstf' element={<EditStaff />} />
            <Route path='viewstf' element={<ViewStaff />} />
            <Route path='addstk' element={<AddStock />} />
            <Route path='viewbook' element={<ViewBooking />} />
            <Route path='viewpresc' element={<ViewPrescription />} />
            <Route path='viewsche' element={<ViewSchedule />} />
            <Route path='admchngpas' element={<AdminChangePassword />} />
            <Route path='viewfeed' element={<ViewFeedback />} />
          </Route>

          {/* Doctor Routes */}
          <Route path='/addsche' element={<AddSchedule />} />
          <Route path='/editsche' element={<EditSchedule />} />
          <Route path='/viewdrsche' element={<ViewdrSchedule />} />
          <Route path='/viewdrbook' element={<ViewdrBooking />} />
          <Route path='/addpres' element={<AddPrescription />} />
          <Route path='/viewdrprof' element={<ViewProfile />} />
          <Route path='/drhome' element={<DoctorHome />} />
          <Route path='/drchngpas' element={<DoctorChangePassword />} />

          {/* User Routes */}
          <Route path='/editprf' element={<EditProfile />} />
          <Route path='/userhome' element={<UserHome />} />
          <Route path='/uschgps' element={<UserChangePassword />} />
          <Route path='/userprf' element={<UserProfile />} />
          <Route path='/usviewdr' element={<ViewDoctors />} />
          <Route path='/usviewbook' element={<ViewBookings />} />
          <Route path='/usviewpres' element={<ViewPrescriptions />} />
          <Route path='/usviewsch' element={<ViewuserSchedule />} />
        </Routes>
      </div>
    </>
  );
}

export default App;