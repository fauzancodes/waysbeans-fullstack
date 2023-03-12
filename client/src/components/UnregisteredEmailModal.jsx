import { Modal } from "react-bootstrap";

export default function UnregisteredEmailModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-add-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#E83939" }}>Sorry, the email you entered was not registered, please register first.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}