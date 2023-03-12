import { Modal } from "react-bootstrap";

export default function SuccessAddProductModal(props) {
  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="success-add-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Success Add Product.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}