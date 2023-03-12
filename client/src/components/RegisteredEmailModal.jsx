import { Modal } from "react-bootstrap";

export default function RegisteredEmailModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-add-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#E83939" }}>This email is already registered, please login.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}