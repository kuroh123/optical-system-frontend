import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "_store";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { sultan_logo } from "assets";

export { NavbarComponent };

function NavbarComponent() {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!authUser) return null;

  return (
    <Navbar
      className="navbar navbar-expand navbar-dark p-1"
      style={{ backgroundColor: "#0c4d0c" }}
    >
      <div>
        <Nav className="navbar-nav" activeKey="/">
          <Nav.Item className="">
            <img src={sultan_logo} alt="Sultan" width={60} height={45} />
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link href="/">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link href="/customer">Customer</Nav.Link>
          </Nav.Item>
          <Nav className="me-auto">
            <Nav.Link href="/billing">Billing</Nav.Link>
          </Nav>
          <NavDropdown title="Inventory" id="nav-dropdown" className="nav-item">
            <NavDropdown.Item href="/products" eventKey="4.1">
              Products
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Setting" id="nav-dropdown" className="nav-item">
            <NavDropdown.Item href="/setting/users" eventKey="4.1">
              Users
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </div>
      <div className="ms-auto">
        <Nav className="navbar-nav">
          <Nav.Item className="nav-item">
            <button onClick={logout} className="btn btn-link nav-item nav-link">
              Logout
            </button>
          </Nav.Item>
        </Nav>
      </div>
    </Navbar>
  );
}
