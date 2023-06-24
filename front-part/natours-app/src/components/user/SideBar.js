import { FaCog, FaListAlt, FaStar, FaMoneyBillAlt } from "react-icons/fa";

const SideBar = () => {
  return (
    <section className="sidebar-user-page">
      <ul className="sidebar-nav">
        <li>
          <a href="/me">
            <FaCog className="icon" />
            Settings
          </a>
        </li>
        <li>
          <a href="#bookings">
            <FaListAlt className="icon" />
            My Bookings
          </a>
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
      </ul>
    </section>
  );
};

export default SideBar;
