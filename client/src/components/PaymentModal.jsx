import { Modal, Form, Button } from "react-bootstrap";

export default function PaymentModal(props) {
  return (
    <>
      <Modal {...props} aria-labelledby="login-modal" centered>
        <Modal.Body>
          <h1 id="login-modal" className="fw-bold custom-text-primary px-3 pb-3 pt-1">
            Payment Information
          </h1>
          <Form onSubmit={props.PaymentOnSubmit} className="px-3 pb-3">
            <Form.Group className="mb-4" controlId="formName">
              <Form.Control type="text" onChange={props.PaymentOnChange} name="name" value={props.formPayment.name} placeholder="Recipient's Name" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Control type="email" onChange={props.PaymentOnChange} name="email" value={props.formPayment.email} placeholder="Recipient's Email" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPhone">
              <Form.Control type="text" onChange={props.PaymentOnChange} name="phone" value={props.formPayment.phone} placeholder="Recipient's Phone Number" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formAddress">
              <Form.Control type="text" onChange={props.PaymentOnChange} name="address" value={props.formPayment.address} placeholder="Shipping Address" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Text className="custom-text-primary fw-bold font-size-24px d-block my-2">
              Qty: {props.qty}
              <br/>
              Total: Rp{props.total}
            </Form.Text>
            <Button onClick={props.onHide} variant="primary" type="submit" className="custom-btn-primary w-100 fw-bold font-size-18px mt-2 p-3">Pay</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}