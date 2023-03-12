import { Modal } from "react-bootstrap";

export default function SuccessRegisterModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Your account is successfully registered.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}