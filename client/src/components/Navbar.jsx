import { React } from "react";
import { Button, Container, Navbar, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavbarSection(props) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar collapseOnSelect expand="lg" fixed="top" style={{ backgroundColor:"#f5f5f5", boxShadow: "0 0.625rem 1.875rem rgba(0, 0, 0, 0.25)" }}>
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <img src="/images/icon-logo.webp" alt="WaysBeans" style={{ height:"4rem" }}/>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {
              props.isLogin === true ? (
                props.isAdmin === false ? (
                  <>
                    <div onClick={() => navigate("/cart")} style={{ cursor:"pointer" }} className="position-relative d-inline">
                      <img src="/images/icon-cart.webp" alt="Cart" className="me-5"/>
                      {
                        props.UserCarts.filter(cart => cart.user_id === props.User.id).length > 0 ? (
                          <span className="position-absolute bg-danger text-light d-flex justify-content-center align-items-center rounded-circle" style={{ width:"1.25rem", height:"1.25rem",top:"0",right:"50%" }}>{props.UserCarts.filter(cart => cart.user_id === props.User.id).length}</span> 
                        ) : null
                      }
                    </div>
                    <Dropdown className="d-inline">
                      <Dropdown.Toggle id="profile-menu" className="border-0" style={{ backgroundColor:"transparent" }}>
                        <img src={
                          props.Profiles.find(profile => profile.user_id === props.User.id)?.photo === "" ? "/images/profile-picture-placeholder.webp" : props.Profiles.find(profile => profile.user_id === props.User.id)?.photo
                        } alt="Profile Icon" className="rounded-circle" style={{ cursor:"pointer", objectFit:"cover", width:"3.75rem", height:"3.75rem" }}/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="border-0" style={{ boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25), 4px 4px 20px rgba(0, 0, 0, 0.25)" }}>
                        <Dropdown.Item onClick={() => navigate("/profile")} className="fw-bold d-flex align-items-center py-2">
                          <img src="/images/icon-profile.webp" alt="Profile" className="me-2" style={{ width:"1.5rem" }}/>
                          Profile
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item onClick={props.logout} className="fw-bold d-flex align-items-center py-2">
                          <img src="/images/icon-logout.webp" alt="Profile" className="me-2" style={{ width:"1.5rem" }}/>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <Dropdown>
                    <Dropdown.Toggle id="profile-menu" className="border-0" style={{ backgroundColor:"transparent" }}>
                    <img src="/images/profile-admin.webp" alt="Profile Icon" className="rounded-circle" style={{ cursor:"pointer", objectFit:"cover", width:"3.75rem", height:"3.75rem" }}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="border-0" style={{ boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25), 4px 4px 20px rgba(0, 0, 0, 0.25)" }}>
                      <Dropdown.Item onClick={() => navigate("/add-product-page")} className="fw-bold d-flex align-items-center py-2">
                        <img src="/images/icon-coffee-bean.webp" alt="Profile" className="me-2" style={{ width:"1.5rem" }}/>
                        Add Product
                      </Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={() => navigate("/list-product")} className="fw-bold d-flex align-items-center py-2">
                        <img src="/images/icon-coffee-bean.webp" alt="Profile" className="me-2" style={{ width:"1.5rem" }}/>
                        List Product
                      </Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={props.logout} className="fw-bold d-flex align-items-center py-2">
                        <img src="/images/icon-logout.webp" alt="Profile" className="me-2" style={{ width:"1.5rem" }}/>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
              ) : (
                <>
                  <Button onClick={props.showModalLogin} variant="outline-primary" className="custom-btn-utilities custom-btn-outline-primary fw-bold me-3">Login</Button>
                  <Button onClick={props.showModalRegister} variant="primary" className="custom-btn-utilities custom-btn-primary fw-bold">Register</Button>
                </>
              )
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}