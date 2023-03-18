import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { API } from '../config/api';

export default function ProductDetails(props) {
  const navigate = useNavigate();

  const params = useParams();
  const Products = props.Products;
  let Product = Products.filter(Product => Product.id === parseInt(params.id));
  Product = Product[0];

  document.title = `${Product?.name} | WaysBeans`;

  const addToCart = async () => {
    if (props.isLogin) {
      if (Product.stock > 0) {
        if (props.UserCarts.filter(cart => cart.user_id === props.User.id).some(item => item.product_id === Product.id)) {
          try {
            await API.patch('/increase-order-quantity/' + Product.id);
          }
          catch (error) {
            return
          }
          const updatedCarts = props.UserCarts.map((cart) => {
            if (cart.user_id === props.User.id && cart.product_id === Product.id) {
              return { ...cart, order_quantity: cart.order_quantity + 1 };
            }
            return cart;
          });
          props.SetUserCarts(updatedCarts);
        }
        else {
          let newCart = {order_quantity:1};
          newCart = JSON.stringify(newCart);
          const config = {
            headers: {
              'Content-type': 'application/json',
            },
          };
          try {
            await API.post('/cart/' + Product.id, newCart, config);
          }
          catch (error) {
            return
          }
          const newCartData = {
            user_id: props.User.id,
            product_id: Product.id,
            order_quantity: 1,
          }
          props.SetUserCarts([...props.UserCarts, newCartData]);
        }
        props.setmodalSuccessAddCart();
        navigate("/");
      }
      else props.setModalOutOfStockShow();
    }
    else props.showModalLogin();
  };

  return (
    <Container>
      <Row className="custom-margin-top justify-content-between align-items-center mx-5 mb-5 responsive-margin-x">
        <Col xs={12} lg={5} className="animate__animated animate__slideInLeft">
          <img src={Product.photo} alt={`${Product.name}`} className="w-100 h-75" style={{ objectFit:"cover" }}/>
        </Col>
        <Col xs={12} lg={6} className="animate__animated animate__slideInRight">
          <h1 className={`${props.darkMode === false ? "product-title" : "text-light"} font-size-48px ${props.darkMode && "text-center"}`} style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>{Product.name}</h1>
          <div className={`product-details ${props.darkMode && "fw-bold"} font-size-18px mb-4`}>Stock: {Product.stock}</div>
          <p className="font-size-18px" style={{ textAlign:"justify", color: props.darkMode ? "#FFFFFF" : "#000000" }}>{Product.description}</p>
          <div className="text-end product-details fw-bold font-size-24px">Rp{Product.price}</div>
          <div className="d-grid mt-5">
            <Button onClick={addToCart} variant="primary" size="lg" className="custom-btn-primary fw-bold font-size-18px w-100">Add Cart</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}