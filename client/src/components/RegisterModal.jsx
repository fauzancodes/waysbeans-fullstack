import { Modal, Form, Button } from "react-bootstrap";

export default function RegisterModal(props) {
  return (
    <Modal {...props} aria-labelledby="register-modal" centered>
      <Modal.Body>
        <h1 id="register-modal" className="fw-bold custom-text-primary px-3 py-4">
          Register
        </h1>
        <Form onSubmit={props.registerOnSubmit} className="px-3 pb-3">
          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Control type="email" onChange={props.registerOnChange} name="email" value={props.formRegister.email} placeholder="Email" className="font-size-18px p-3 custom-form-input" required/>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Control type="password" onChange={props.registerOnChange} name="password" value={props.formRegister.password} placeholder="Password" className="font-size-18px p-3 custom-form-input" required/>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formText">
            <Form.Control type="text" onChange={props.registerOnChange} name="name" value={props.formRegister.name} placeholder="Full Name" className="font-size-18px p-3 custom-form-input" required/>
          </Form.Group>
          <Button variant="primary" type="submit" className="custom-btn-primary w-100 fw-bold font-size-18px mb-2 mt-2 p-3">Register</Button>
          <Form.Text className="text-body font-size-18px text-center d-block">
            Already have an account ? Klik <strong onClick={props.changeModal} style={{ cursor:"pointer" }}>Here</strong>
          </Form.Text>
        </Form>
      </Modal.Body>
    </Modal>
  );
}