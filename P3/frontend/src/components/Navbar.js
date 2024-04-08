import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
    return (
        <div className="navbar">
            <Link to="/accounts/profile/view">
                <img style={{ borderRadius: "50%" }} src={require("./images/profile.png")} alt="" width="30" height="30" />
                <p>Profile</p>
            </Link>
            <a href="dashboard.html"><img src={require("./images/home.png")} alt="" width="30" height="30" />
                <p>Home</p>
            </a>
            <Link to="/calendar" className="active">
                <img src={require("./images/calendar.png")} alt="" width="30" height="30" />
                <p>Calendar</p>
            </Link>
            <a href="contacts_curr.html"><img src={require("./images/contacts.png")} alt="" width="30" height="30" />
                <p>Contacts</p>
            </a>
        </div>
    )
}

export default Navbar