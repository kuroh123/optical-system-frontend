import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "_store";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export { NavbarComponent };

function NavbarComponent() {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!authUser) return null;

  return (
    <Navbar className="navbar navbar-expand navbar-dark bg-dark">
      <Nav className="navbar-nav" activeKey="/">
        <Nav.Item className="nav-item">
          <Nav.Link href="/">Dashboard</Nav.Link>
        </Nav.Item>
        <NavDropdown title="Patient" id="nav-dropdown" className="nav-item">
          <NavDropdown.Item href="/register" eventKey="4.1">
            Register Patient
          </NavDropdown.Item>
          <NavDropdown.Item href="/patient" eventKey="4.2">
            Patient Summary
          </NavDropdown.Item>
        </NavDropdown>
        <Nav className="me-auto">
          <Nav.Link href="/billing">Billing</Nav.Link>
        </Nav>
        <NavDropdown title="Inventory" id="nav-dropdown" className="nav-item">
          <NavDropdown.Item href="/products" eventKey="4.1">
            Products
          </NavDropdown.Item>
          <NavDropdown.Item href="/xyz" eventKey="4.2">
            xyz
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav className="navbar-nav ml-auto">
        <Nav.Item className="nav-item ml-auto">
          <button onClick={logout} className="btn btn-link nav-item nav-link">
            Logout
          </button>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
