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
          <a href="#reviews">
            <FaStar className="icon" />
            My Reviews
          </a>
        </li>
        <li>
          <a href="#billing">
            <FaMoneyBillAlt className="icon" />
            Billing
          </a>
        </li>
        <br />
        <br />
        {role === 'admin' && (
          <>
            <div style={{ color: 'azure', marginLeft: '12px' }}>Admin</div>
            <hr />
            <br />
            <li>
              <a href="#billing">
                <FaMapMarkerAlt className="icon" />
                Manage Tours
              </a>
            </li>
            <li>
              <a href="#billing">
                <FaUsers className="icon" />
                Manage Users
              </a>
            </li>
            <li>
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
            </li>
          </>
        )}
      </ul>
    </section>
  );
};

export default SideBar;
