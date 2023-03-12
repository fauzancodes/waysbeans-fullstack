import { Modal } from "react-bootstrap";

export default function OutOfStockModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#E83939" }}>Out of stock.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}