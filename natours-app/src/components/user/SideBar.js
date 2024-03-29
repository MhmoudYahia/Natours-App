import {
  FaCog,
  FaListAlt,
  FaStar,
  FaMoneyBillAlt,
  FaUsers,
  FaBook,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SideBar = ({ role, userId }) => {
  return (
    <section className="sidebar-user-page">
      <ul className="sidebar-nav">
        <li>
          <a href="#f">
            <FaCog className="icon" />
            Settings
          </a>
        </li>
        <li>
          <Link to="/my-bookings" state={userId}>
            <FaListAlt className="icon" />
            My Bookings
          </Link>
        </li>
        <li>
          <Link to="/my-reviews" state={userId}>
            <FaStar className="icon" />
            My Reviews
          </Link>
        </li>
        <li>
          <a href="#billing">
            <FaMoneyBillAlt className="icon" />
            Billing
          </a>
        </li>
        <br />
        <br />
        {(role === 'admin' || role === 'guide' || role === 'lead-guide') && (
          <>
            <div
              style={{
                color: 'azure',
                marginLeft: '12px',
                textTransform: 'capitalize',
              }}
            >
              {role}
            </div>
            <hr />
            <br />
            <li>
              <Link to="/manage-tours-panel" state={{ role, userId }}>
                <FaMapMarkerAlt className="icon" />
                Manage Tours
              </Link>
            </li>
            <li>
              <Link to="/manage-users-panel" state={{ role, userId }}>
                <FaUsers className="icon" />
                Manage Users
              </Link>
            </li>
            {/* <li>
              <a href="#billing">
                <FaStar className="icon" />
                Manage Reviews
              </a>
            </li>
            <li>
              <a href="#billing">
                <FaBook className="icon" />
                Manage Bookings
              </a>
            </li> */}
          </>
        )}
      </ul>
    </section>
  );
};

export default SideBar;
