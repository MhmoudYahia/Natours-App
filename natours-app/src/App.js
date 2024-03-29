import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';

import { Navbar } from './components/header/Navbar';
import { Footer } from './components/footer/Footer';
import { BodyTours } from './components/body/BodyTours';
import { SignIn } from './components/signup-in/SignIn';
import { SignUp } from './components/signup-in/SignUp';
import { UserPage } from './components/user/UserPage';
import { TourDetails } from './components/body/TourDetails';
import { Page404 } from './components/error/Page404';
import { MyBookings } from './components/user/MyBookings';
import { ForgetPassword } from './components/signup-in/ForgetPassword';
import { ResetPassword } from './components/signup-in/ResetPassword';
import { MyReviewsPage } from './components/user/MyReviews';
import { ManageTourPanel } from './components/manager/manageTours/ManageToursPanel';
import { ManageUsersPanel } from './components/manager/manageUsers/ManageUsersPanel';

function App() {
  return (
    <div className="App">
      <Router path="/">
        <Routes>
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<BodyTours />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/tour/:id" element={<TourDetails />}></Route>
            <Route path="/me" element={<UserPage />}></Route>
            <Route path="/my-bookings" element={<MyBookings />}></Route>
            <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
            <Route
              path="/resetpassword/:resetToken"
              element={<ResetPassword />}
            ></Route>
            <Route path="/my-reviews" element={<MyReviewsPage />}></Route>
            <Route
              path="/manage-tours-panel"
              element={<ManageTourPanel />}
            ></Route>
            <Route
              path="/manage-users-panel"
              element={<ManageUsersPanel />}
            ></Route>
          </Route>

          <Route path="*" element={<Page404 />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
