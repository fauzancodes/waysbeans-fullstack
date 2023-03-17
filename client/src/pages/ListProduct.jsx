import { Container, Table, Button, Modal } from 'react-bootstrap';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from 'react-query';

import { API } from '../config/api';

export default function ProductDetails(props) {
  document.title = "Products List | WaysBeans";
  useQuery('productsCache', async () => {
    try {
      const response = await API.get('/products');
      props.SetProductsList(response.data.data);
    }
    catch (error) {
      return
    }
  });

  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/product/${id}`);
    }
    catch (error) {
      return
    }
    props.SetProductsList((products) => {
      return products.filter((item) => item.id !== id);
    });
    setModalDeleteProduct(false);
    setModalSuccessDeleteProduct(true);
  };

  async function UpdateProduct(id) {
    try {
      const responseProduct = await API.get('/product/' + id);
      props.setImageUrl(responseProduct.data.data.photo);
  
      props.setformUpdateProduct({
        ...props.formUpdateProduct,
        id: responseProduct.data.data.id,
        name: responseProduct.data.data.name,
        description: responseProduct.data.data.description,
        price: responseProduct.data.data.price,
        stock: responseProduct.data.data.stock,
      });
    }
    catch (error) {
      return
    }

    navigate(`/update-product-page/${id}`);
  }

  let ProductsListSorted = [];
  if (props.Products !== undefined) {
    ProductsListSorted = [...props.Products];
    ProductsListSorted.sort((a, b) => b.id - a.id);
  }

  const [modalDeleteProduct, setModalDeleteProduct] = useState(false);
  const [modalSuccessDeleteProduct, setModalSuccessDeleteProduct] = useState(false);
  const [productId, setProductId] = useState(0);

  return (
    <>
      <Modal show={modalDeleteProduct} onHide={() => setModalDeleteProduct(false)} aria-labelledby="delete-product-modal" centered>
        <Modal.Body className="p-4">
          <p className="font-size-24px text-center mb-4">Are you sure you want to delete this product?</p>
          <div className="d-flex justify-content-around">
            <Button onClick={() => setModalDeleteProduct(false)} variant="secondary">Cancel</Button>
            <Button onClick={() => deleteProduct(productId)} variant="danger">Delete</Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={modalSuccessDeleteProduct} onHide={() => setModalSuccessDeleteProduct(false)} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Success Delete Product.</p>
        </Modal.Body>
      </Modal>
      <Container>
        <h1 className={`custom-margin-top ${props.darkMode ? "fw-bold text-light text-center" : "product-title"} font-size-36px mb-5`}style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>List Product</h1>
        {
          ProductsListSorted.length > 0 ? (
            <Table responsive bordered hover className="mx-auto w-100 animate__animated animate__fadeIn mb-5">
              <thead style={{ backgroundColor:"#E5E5E5" }}>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  ProductsListSorted.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{index + 1}</td>
                      <td><img src={item.photo} alt={item.name} style={{ width:"7.5rem", height:"10rem", objectFit:"cover" }}/></td>
                      <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{item.name}</td>
                      <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{item.stock}</td>
                      <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{item.price}</td>
                      <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{item.description}</td>
                      <td style={{ width:"15rem" }}>
                        <Button onClick={() => {setProductId(item.id);setModalDeleteProduct(true)}} variant="danger" className="py-0 me-2 button-delete mb-2" style={{ width:"48%" }}>delete</Button>
                        <Button onClick={() => UpdateProduct(item.id)} variant="success" className="py-0 button-update mb-2" style={{ width:"48%" }}>update</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          ) : <p className={`${props.darkMode && "text-light"} opacity-50`}>There are no products to display.</p>
        }
      </Container>
    </>
  )
}