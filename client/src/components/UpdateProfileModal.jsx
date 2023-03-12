import { Modal, Form, Button } from "react-bootstrap";

export default function UpdateProfileModal(props) {
  return (
    <>
      <Modal {...props} aria-labelledby="login-modal" centered>
        <Modal.Body>
          <h1 id="login-modal" className="fw-bold custom-text-primary px-3 py-4">
            Update Profile
          </h1>
          <Form onSubmit={props.UpdateProfileOnSubmit} className="px-3 pb-3">
            <label for="profile-picture-update" className="rounded d-flex justify-content-center">
              <img src={props.profilePicture} alt="Profile" className="rounded" style={{ width:"11rem", height:"14rem", objectFit:"cover", cursor:"pointer" }}/>
            </label>
            <input type="file" id="profile-picture-update" className="d-none" onChange={props.handleProfilePictureUpload}></input>
            <Form.Group className="my-4" controlId="formName">
              <Form.Control type="text" onChange={props.UpdateProfileOnChange} name="name" value={props.formUpdateProfile.name} placeholder="Full Name" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Control type="email" onChange={props.UpdateProfileOnChange} name="email" value={props.formUpdateProfile.email} placeholder="Email" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Control type="password" onChange={props.UpdateProfileOnChange} name="password" value={props.formUpdateProfile.password} placeholder="Password" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Button variant="primary" type="submit" className="custom-btn-primary w-100 fw-bold font-size-18px mb-2 mt-2 p-3">Update Profile</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}