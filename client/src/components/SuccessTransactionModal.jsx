import { Modal } from "react-bootstrap";

export default function SuccessTransactionModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-transaction-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Thank you for ordering in us, please wait 1 x 24 hours to verify you order.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}