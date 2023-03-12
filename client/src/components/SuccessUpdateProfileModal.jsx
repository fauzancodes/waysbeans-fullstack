import { Modal } from "react-bootstrap";

export default function SuccessUpdateProfileModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Your profile is successfully updated.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}