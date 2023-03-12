import { Container, Col, Row, Form, Button } from "react-bootstrap";

function AddProductPage(props) {
  document.title = "Add Product| WaysBeans";

  return (
    <Container>
      <Row className="custom-margin-top justify-content-between mx-5 responsive-margin-x">
        <Col xs={12} lg={6} className="mb-4 animate__animated animate__slideInLeft">
          <h1 className="fw-bold custom-text-primary mb-5">Add Product</h1>
          <Form onSubmit={props.AddProductOnSubmit}>
            <Form.Group className="mb-4" controlId="formName">
              <Form.Control type="text" onChange={props.AddProductOnChange} placeholder="Name" value={props.formAddProduct.name} name="name" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formStock">
              <Form.Control type="number" onChange={props.AddProductOnChange} placeholder="Stock" value={props.formAddProduct.stock} name="stock" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPrice">
              <Form.Control type="number" onChange={props.AddProductOnChange} placeholder="Price" value={props.formAddProduct.price} name="price" className="font-size-18px p-3 custom-form-input" required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formDescription">
              <Form.Control as="textarea" onChange={props.AddProductOnChange} placeholder="Product Description" value={props.formAddProduct.description} name="description" className="font-size-18px p-3 custom-form-input" rows={4} required/>
            </Form.Group>
            <div id="product-photo-container" className="font-size-18px p-3 py-2 custom-form-input rounded w-50">
              <label htmlFor="product-photo" className="d-flex justify-content-between align-items-center" style={{ color:"rgba(97, 61, 43, 0.5)",cursor:"pointer" }}>
                Product Photo
                <img src="/images/icon-paperclip.png" alt="Attach File" style={{ width:"2rem",transform:"rotate(-45deg)" }}/>
              </label>
              <input id="product-photo" type="file" onChange={props.AddProductOnChange} name="photo" className="d-none"/>
            </div>
            <div className="d-flex justify-content-center mb-2 mt-5">
              <Button variant="primary" type="submit" className="custom-btn-primary w-50 fw-bold font-size-18px py-1">Add Product</Button>
            </div>
          </Form>
        </Col>
        <Col xs={12} lg={5} className="mb-4 animate__animated animate__slideInRight">
          <img src={props.imageUrl} alt="Product Preview" className="w-100 h-75" style={{ objectFit:"cover" }}/>
        </Col>
      </Row>
    </Container>
  );
}

export default AddProductPage; 