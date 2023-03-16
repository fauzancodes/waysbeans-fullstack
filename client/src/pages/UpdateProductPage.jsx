import { Container, Col, Row, Form, Button } from "react-bootstrap";

function UpdateProductPage(props) {
  document.title = `Update Product | WaysBeans`;

  return (
    <Container>
      <Row className="custom-margin-top justify-content-between mx-5 responsive-margin-x">
        <Col xs={12} lg={6} className="mb-4 animate__animated animate__slideInLeft">
          <h1 className={`fw-bold ${props.darkMode ? "text-light" : "custom-text-primary"} mb-5`}  style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>Update Product</h1>
          <Form onSubmit={props.UpdateProductOnSubmit}>
            <Form.Group className="mb-4 d-none" controlId="formId">
              <Form.Control type="text" onChange={props.UpdateProductOnChange} placeholder="Id" value={props.formUpdateProduct.id} name="id" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formName">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Name</Form.Label>
                )
              }
              <Form.Control type="text" onChange={props.UpdateProductOnChange} placeholder="Name" value={props.formUpdateProduct.name} name="name" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formStock">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Stock</Form.Label>
                )
              }
              <Form.Control type="number" onChange={props.UpdateProductOnChange} placeholder="Stock" value={props.formUpdateProduct.stock} name="stock" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPrice">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Price</Form.Label>
                )
              }
              <Form.Control type="number" onChange={props.UpdateProductOnChange} placeholder="Price" value={props.formUpdateProduct.price} name="price" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formDescription">
              {
                props.darkMode && (
                  <Form.Label className="text-light fw-bold">Description</Form.Label>
                )
              }
              <Form.Control as="textarea" onChange={props.UpdateProductOnChange} placeholder="Product Description" value={props.formUpdateProduct.description} name="description" className={`font-size-18px p-3 custom-form-input ${props.darkMode && "text-light"}`} rows={4} required/>
            </Form.Group>
            {
              props.darkMode && (
                <Form.Label className="text-light fw-bold">Photo</Form.Label>
              )
            }
            <div id="product-photo-container" className="font-size-18px p-3 py-2 custom-form-input rounded w-50">
              <label htmlFor="product-photo" className="d-flex justify-content-between align-items-center" style={{ color:"rgba(97, 61, 43, 0.5)",cursor:"pointer" }}>
                Product Photo
                <img src="/images/icon-paperclip.png" alt="Attach File" style={{ width:"2rem",transform:"rotate(-45deg)" }}/>
              </label>
              <input id="product-photo" type="file" onChange={props.UpdateProductOnChange} name="photo" className="d-none"/>
            </div>
            <div className="d-flex justify-content-center mb-2 mt-5">
              <Button variant="primary" type="submit" className="custom-btn-primary w-50 fw-bold font-size-18px py-1">Update Product</Button>
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

export default UpdateProductPage; 