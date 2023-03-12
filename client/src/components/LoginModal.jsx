import { Modal, Form, Button } from "react-bootstrap";

export default function LoginModal(props) {
  return (
    <>
      <Modal {...props} aria-labelledby="login-modal" centered>
        <Modal.Body>
          <h1 id="login-modal" className="fw-bold custom-text-primary px-3 py-4">
            Login
          </h1>
          <Form onSubmit={props.loginOnSubmit} className="px-3 pb-3">
            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Control type="email" onChange={props.loginOnChange} name="email" value={props.formLogin.email} placeholder="Email" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Control type="password" onChange={props.loginOnChange} name="password" value={props.formLogin.password} placeholder="Password" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Button variant="primary" type="submit" className="custom-btn-primary w-100 fw-bold font-size-18px mb-2 mt-2 p-3">Login</Button>
            <Form.Text className="text-body font-size-18px text-center d-block">
              Don't have an account ? Klik <strong onClick={props.changeModal} style={{ cursor:"pointer" }}>Here</strong>
            </Form.Text>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}