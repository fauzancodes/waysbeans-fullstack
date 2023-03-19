import { Container, Col, Row, Form, Button } from "react-bootstrap";

function UpdateProfilePage(props) {
  document.title = `Update Profile | WaysBeans`;

  return (
    <Container>
      <Row className="custom-margin-top justify-content-between mx-5 responsive-margin-x">
        <Col xs={12} lg={6} className="mb-4 animate__animated animate__slideInLeft">
          <h1 className={`fw-bold ${props.darkMode ? "text-light" : "custom-text-primary"} mb-5`}  style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>Update Profile</h1>
          <Form onSubmit={props.UpdateProfileOnSubmit}>
            <Form.Group className={props.darkMode ? "mb-2" : "mb-4"} controlId="formPhone">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Phone Number</Form.Label>
                )
              }
              <Form.Control type="text" onChange={props.UpdateProfileOnChange} placeholder="Phone" value={props.formUpdateProfile.phone} name="phone" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            <Form.Group className={props.darkMode ? "mb-2" : "mb-4"} controlId="formAddress">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Address & Postcode</Form.Label>
                )
              }
              <Form.Control type="text" onChange={props.UpdateProfileOnChange} placeholder="Address & Postcode" value={props.formUpdateProfile.address} name="address" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            {
              props.darkMode && (
                <Form.Label className="text-light fw-bold">Photo</Form.Label>
              )
            }
            <div id="profile-photo-container" className="font-size-18px p-3 py-2 custom-form-input rounded w-50">
              <label htmlFor="profile-photo" className="d-flex justify-content-between align-items-center" style={{ color:"rgba(97, 61, 43, 0.5)",cursor:"pointer" }}>
                Profile Photo
                <img src="/images/icon-paperclip.png" alt="Attach File" style={{ width:"2rem",transform:"rotate(-45deg)" }}/>
              </label>
              <input id="profile-photo" type="file" onChange={props.UpdateProfileOnChange} name="photo" className="d-none"/>
            </div>
            <div className="d-flex justify-content-center mb-2 mt-5">
              <Button variant="primary" type="submit" className="custom-btn-primary w-50 fw-bold font-size-18px py-1">Update Profile</Button>
            </div>
          </Form>
        </Col>
        <Col xs={12} lg={5} className="mb-4 animate__animated animate__slideInRight">
          <img src={props.imageUrl} alt="Profile Preview" className="w-100" style={{ objectFit:"cover", height:"32rem" }}/>
        </Col>
      </Row>
    </Container>
  );
}

export default UpdateProfilePage; 