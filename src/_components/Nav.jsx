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
            active={param1 === "customer"}
            title="Customer"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/customer/customers">
              Customers
            </NavDropdown.Item>
            <NavDropdown.Item href="/customer/customerOrders">
              Customer Orders
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            active={param1 === "billing"}
            title="Billing"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/billing/invoices">
              Invoices
            </NavDropdown.Item>
            <NavDropdown.Item href="/billing/transactions">
              Transactions
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            active={param1 === "inventory"}
            title="Inventory"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/inventory/products">
              Products
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            active={param1 === "setting"}
            title="Setting"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/setting/users">Users</NavDropdown.Item>
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
