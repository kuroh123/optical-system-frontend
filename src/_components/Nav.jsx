import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "_store";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { sultan_logo } from "assets";

const NavbarComponent = () => {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());
  const location = useLocation();
  const params = location.pathname.split("/").filter((item) => item !== "");
  const param1 = params.length > 0 ? params[0] : "";

  // only show nav when logged in
  if (!authUser) return null;

  return (
    <Navbar
      variant="dark"
      expand="md"
      className="p-0 ps-1"
      style={{ backgroundColor: "#04364A" }}
    >
      <Navbar.Brand
        href="/"
        // style={{ border: "1px solid black", borderRadius: "6px" }}
      >
        <img
          style={{ border: "1px solid black", borderRadius: "6px" }}
          src={sultan_logo}
          alt="Sultan"
          width={60}
          height={45}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto ">
          <Nav.Link href="/" active={param1 === ""}>
            Dashboard
          </Nav.Link>
          <NavDropdown
            active={param1 === "customers" || param1 === "customerOrders"}
            title="Customer"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/customers">Customers</NavDropdown.Item>
            <NavDropdown.Item href="/customerOrders">
              Customer Orders
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            active={param1 === "invoices"}
            title="Billing"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/invoices">Invoices</NavDropdown.Item>
            {/* <NavDropdown.Item href="/transactions">
              Transactions
            </NavDropdown.Item> */}
          </NavDropdown>
          <NavDropdown
            active={param1 === "products"}
            title="Inventory"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/products">Products</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            active={param1 === "users"}
            title="Setting"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/users">Users</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Item>
            <button onClick={logout} className="btn btn-link nav-item nav-link">
              Logout
            </button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
