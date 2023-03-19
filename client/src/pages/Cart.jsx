import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query';
import { API } from '../config/api';

import PaymentModal from '../components/PaymentModal';

export default function ProductDetails(props) {
  document.title = "My Cart | WaysBeans";
  const navigate = useNavigate();

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
  
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const [formPayment, setformPayment] = useState({
    name: props.User.name,
    email: props.User.email,
    phone: props.Profiles.find(profile => profile.user_id === props.User.id)?.phone,
    address: props.Profiles.find(profile => profile.user_id === props.User.id)?.address,
    total_quantity: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0),
    total_price: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0),
  });
  const formPaymentHandleOnChange = (e) => {
    setformPayment({
      ...formPayment,
      [e.target.name]: e.target.value,
    });
  };
  const formPaymentHandleOnSubmit = useMutation(async (e) => {
    e.preventDefault();
    if (props.UserCarts.filter(cart => cart.user_id === props.User.id).some(cart => cart.order_quantity > props.Products.find(product => product.id === cart.product_id).stock)) {
      setModalPaymentShow(false);
      setModalExceedStock(true);
    }
    else {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const formData = new FormData();
      formData.set('name', formPayment.name);
      formData.set('email', formPayment.email);
      formData.set('phone', formPayment.phone);
      formData.set('address', formPayment.address);
  
      let formDataObject = {};
      for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }
      const formDataJSON = JSON.stringify(formDataObject);
      try {
        const response = await API.post('/transaction', formDataJSON, config);
        const token = response.data.data.token;
        
        window.snap.pay(token, {
          onSuccess: function (result) {
            for (let cart of props.UserCarts.filter(cart => cart.user_id === props.User.id)) {
              const updatedProducts = props.Products.map((product) => {
                if (product.id === cart.product_id) {
                  return { ...product, stock: product.stock - cart.order_quantity };
                }
                return product;
              });
              props.SetProducts(updatedProducts);
            }
            const paidProducts = [];
            for (let cart of props.UserCarts.filter(cart => cart.user_id === props.User.id)) {
              const newProduct = {product_name: props.Products.find(product => product.id === cart.product_id).name, product_photo: props.Products.find(product => product.id === cart.product_id).photo};
              paidProducts.push(newProduct);
            }
            props.SetUserCarts([]);
            const newTransactionData = {
              id: props.Transactions.length + 1,
              name: formPayment.name,
              email: formPayment.email,
              phone: formPayment.phone,
              address: formPayment.address,
              date: new Date(),
              products: paidProducts,
              total_quantity: formPayment.total_quantity,
              total_price: formPayment.total_price,
              status: "success",
              user: {id:props.User.id},
            }
            props.SetTransactions([...props.Transactions, newTransactionData]);
            
            setformPayment((formPayment) => ({
              ...formPayment,
              name: props.User.name,
              email: props.User.email,
              phone: props.Profiles.find(profile => profile.user_id === props.User.id).phone,
              address: props.Profiles.find(profile => profile.user_id === props.User.id).address,
              total_quantity: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0),
              total_price: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0),
            }));
      
            props.showModalSuccessTransaction();
            navigate("/profile");
          },
          onPending: function (result) {
            const paidProducts = [];
            for (let cart of props.UserCarts.filter(cart => cart.user_id === props.User.id)) {
              const newProduct = {product_name: props.Products.find(product => product.id === cart.product_id).name, product_photo: props.Products.find(product => product.id === cart.product_id).photo};
              paidProducts.push(newProduct);
            }
            props.SetUserCarts([]);
            const newTransactionData = {
              id: props.Transactions.length + 1,
              name: formPayment.name,
              email: formPayment.email,
              phone: formPayment.phone,
              address: formPayment.address,
              date: new Date(),
              products: paidProducts,
              total_quantity: formPayment.total_quantity,
              total_price: formPayment.total_price,
              status: "pending",
              user: {id:props.User.id},
            }
            props.SetTransactions([...props.Transactions, newTransactionData]);
            
            setformPayment((formPayment) => ({
              ...formPayment,
              name: props.User.name,
              email: props.User.email,
              phone: props.Profiles.find(profile => profile.user_id === props.User.id).phone,
              address: props.Profiles.find(profile => profile.user_id === props.User.id).address,
              total_quantity: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0),
              total_price: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0),
            }));
      
            props.showModalSuccessTransaction();
            navigate("/profile");
          },
          onError: function (result) {
            const paidProducts = [];
            for (let cart of props.UserCarts.filter(cart => cart.user_id === props.User.id)) {
              const newProduct = {product_name: props.Products.find(product => product.id === cart.product_id).name, product_photo: props.Products.find(product => product.id === cart.product_id).photo};
              paidProducts.push(newProduct);
            }
            const newTransactionData = {
              id: props.Transactions.length + 1,
              name: formPayment.name,
              email: formPayment.email,
              phone: formPayment.phone,
              address: formPayment.address,
              date: new Date(),
              products: paidProducts,
              total_quantity: formPayment.total_quantity,
              total_price: formPayment.total_price,
              status: "failed",
              user: {id:props.User.id},
            }
            props.SetTransactions([...props.Transactions, newTransactionData]);
            
            setformPayment((formPayment) => ({
              ...formPayment,
              name: props.User.name,
              email: props.User.email,
              phone: props.Profiles.find(profile => profile.user_id === props.User.id).phone,
              address: props.Profiles.find(profile => profile.user_id === props.User.id).address,
              total_quantity: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0),
              total_price: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0),
            }));
      
            props.showModalSuccessTransaction();
            navigate("/profile");
          },
          onClose: function () {
            const paidProducts = [];
            for (let cart of props.UserCarts.filter(cart => cart.user_id === props.User.id)) {
              const newProduct = {product_name: props.Products.find(product => product.id === cart.product_id).name, product_photo: props.Products.find(product => product.id === cart.product_id).photo};
              paidProducts.push(newProduct);
            }
            const newTransactionData = {
              id: props.Transactions.length + 1,
              name: formPayment.name,
              email: formPayment.email,
              phone: formPayment.phone,
              address: formPayment.address,
              date: new Date(),
              products: paidProducts,
              total_quantity: formPayment.total_quantity,
              total_price: formPayment.total_price,
              status: "failed",
              user: {id:props.User.id},
            }
            props.SetTransactions([...props.Transactions, newTransactionData]);
            
            setformPayment((formPayment) => ({
              ...formPayment,
              name: props.User.name,
              email: props.User.email,
              phone: props.Profiles.find(profile => profile.user_id === props.User.id).phone,
              address: props.Profiles.find(profile => profile.user_id === props.User.id).address,
              total_quantity: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0),
              total_price: props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0),
            }));
      
            props.showModalSuccessTransaction();
            navigate("/profile");
          },
        });
      }
      catch (error) {
        return
      }
    }
  });
  
  const [modalPaymentShow, setModalPaymentShow] = useState(false);

  const increaseQuantity = async (product_id) => {
    if (props.UserCarts.find(cart => cart.product_id === product_id && cart.user_id === props.User.id).order_quantity < props.Products.find(product => product.id === props.UserCarts.find(cart => cart.product_id === product_id && cart.user_id === props.User.id).product_id).stock) {
      try {
        await API.patch('/increase-order-quantity/' + product_id);
      }
      catch (error) {
        return
      }
      const updatedCarts = props.UserCarts.map((cart) => {
        if (cart.user_id === props.User.id) {
          if (cart.product_id === product_id) {
            return { ...cart, order_quantity: cart.order_quantity + 1 };
          }
          return cart;
        }
        return cart;
      });
      props.SetUserCarts(updatedCarts);
    }
    else setModalExceedStock(true);
  }
  const decreaseQuantity = async (product_id) => {
    if (props.UserCarts.find(cart => cart.product_id === product_id && cart.user_id === props.User.id).order_quantity > 1) {
      try {
        await API.patch('/decrease-order-quantity/' + product_id);
      }
      catch (error) {
        return
      }
      const updatedCarts = props.UserCarts.map((cart) => {
        if (cart.user_id === props.User.id) {
          if (cart.product_id === product_id) {
            return { ...cart, order_quantity: cart.order_quantity - 1 };
          }
          return cart;
        }
        return cart;
      });
      props.SetUserCarts(updatedCarts);
    }
  }
  const deleteCart = async (product_id) => {
    try {
      await API.delete('/cart/' + product_id);
    }
    catch (error) {
      return
    }
    props.SetUserCarts((userCarts) => {
      return userCarts.filter((item) => !(item.user_id === props.User.id && item.product_id === product_id));
    });
    setModalDeleteCart(false);
    setModalSuccessDeleteCart(true);
  };

  const [modalDeleteCart, setModalDeleteCart] = useState(false);
  const [modalSuccessDeleteCart, setModalSuccessDeleteCart] = useState(false);
  const [modalExceedStock, setModalExceedStock] = useState(false);
  const [cartProductId, setCartProductId] = useState(0);

  return (
    <>
      <PaymentModal 
        show={modalPaymentShow} 
        onHide={() => setModalPaymentShow(false)} 
        total={props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0)}
        qty={props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0)} 
        formPayment={formPayment} 
        PaymentOnChange={(e) => formPaymentHandleOnChange(e)}
        PaymentOnSubmit={(e) => formPaymentHandleOnSubmit.mutate(e)}
      />
      <Modal show={modalDeleteCart} onHide={() => setModalDeleteCart(false)} aria-labelledby="delete-product-modal" centered>
        <Modal.Body className="p-4">
          <p className="font-size-24px text-center mb-4">Are you sure you want to delete this cart?</p>
          <div className="d-flex justify-content-around">
            <Button onClick={() => setModalDeleteCart(false)} variant="secondary">Cancel</Button>
            <Button onClick={() => deleteCart(cartProductId)} variant="danger">Delete</Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={modalSuccessDeleteCart} onHide={() => setModalSuccessDeleteCart(false)} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#469F74" }}>Success Delete Cart.</p>
        </Modal.Body>
      </Modal>
      <Modal show={modalExceedStock} onHide={() => setModalExceedStock(false)} size="lg" aria-labelledby="success-update-product-modal" centered>
        <Modal.Body className="p-5">
          <p className="font-size-24px text-center" style={{ color:"#E83939" }}>The order quantity exceeds the product stock.</p>
        </Modal.Body>
      </Modal>
      <Container>
        <Row className="custom-margin-top mx-5 responsive-margin-x mb-5">
          <h1 className={`px-0 ${props.darkMode ? "fw-bold text-light text-center" : "product-title"}`} style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>My Cart</h1>
          <p className={`px-0 font-size-18px ${props.darkMode ? "text-light" : "custom-text-primary"}`}>Review Your Order</p>
          <Row className="justify-content-between align-items-start px-0">
            <Col xs={12} lg={7}>
            {
              props.UserCarts.filter(cart => cart.user_id === props.User.id).length > 0 ? (
                props.UserCarts.filter(cart => cart.user_id === props.User.id).map((item, index) => (
                  <Col key={index} xs={12} className={`py-4 px-0 mb-4 animate__animated animate__slideInLeft`} style={{ borderTop:"1px solid #613D2B",borderBottom:"1px solid #613D2B", backgroundColor: props.darkMode ? "#F6E6DA" : "transparent" }}>
                    <div className={`d-flex justify-content-between align-items-center ${props.darkMode && "px-4"}`}>
                      <div className="d-flex flex-wrap align-items-center">
                        <img src={props.Products.find(product => product.id === item.product_id).photo} alt={props.Products.find(product => product.id === item.product_id).name} className="me-3" style={{ width:"7.5rem", height:"10rem", objectFit:"cover" }}/>
                        <div className="">
                          <h3 className="product-title font-size-18px mb-4">{props.Products.find(product => product.id === item.product_id).name}</h3>
                          <div className="d-flex align-items-center">
                            <img src="/images/icon-decrease.webp" alt="Decrease Button" onClick={() => decreaseQuantity(item.product_id)} style={{ cursor:"pointer" }}/>
                            <span className="font-size-18px custom-text-primar px-3 mx-3 rounded" style={{ backgroundColor:"#F6E6DA" }}>{item.order_quantity}</span>
                            <img src="/images/icon-increase.webp" alt="Increase Button" onClick={() => increaseQuantity(item.product_id)} style={{ cursor:"pointer" }}/>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="product-details font-size-18px mb-4">{props.Products.find(product => product.id === item.product_id).price.toLocaleString("id-ID", {style: "currency",currency: "IDR"})}</div>
                        <div className="text-end"><img src="/images/icon-delete.webp" alt="Delete Order" onClick={() => {setCartProductId(item.product_id);setModalDeleteCart(true)}} style={{ cursor:"pointer" }}/></div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : <p className={`${props.darkMode && "text-light"} opacity-50`}>There are no items in your cart.</p>
            }
            </Col>
            {
              props.UserCarts.filter(cart => cart.user_id === props.User.id).length > 0 && (
                <Col xs={12} lg={4} className={`py-4 px-0 ms-2 animate__animated animate__slideInRight`} style={{ borderTop:"1px solid #613D2B", backgroundColor: props.darkMode ? "#F6E6DA" : "transparent" }}>
                  <div className={`d-flex justify-content-between mb-4 font-size-18px ${props.darkMode && "px-4"}`}>
                    <div className="product-details">Subtotal</div>
                    <div className="product-details">{props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0).toLocaleString("id-ID", {style: "currency",currency: "IDR"})}</div>
                  </div>
                  <div className={`d-flex justify-content-between pb-4 font-size-18px ${props.darkMode && "px-4"}`} style={{ borderBottom:"1px solid #613D2B" }}>
                    <div className="product-details">Qty</div>
                    <div className="product-details">{props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentValue) => accumulator + currentValue.order_quantity, 0)}</div>
                  </div>
                  <div className={`d-flex justify-content-between mt-4 font-size-18px ${props.darkMode && "px-4"}`}>
                    <div className="product-details fw-bold">Total</div>
                    <div className="product-details fw-bold">{props.UserCarts.filter(cart => cart.user_id === props.User.id).reduce((accumulator, currentCart) => accumulator + (currentCart.order_quantity * props.Products.find(product => product.id === currentCart.product_id).price), 0).toLocaleString("id-ID", {style: "currency",currency: "IDR"})}</div>
                  </div>
                  <div className={`d-flex ${props.darkMode ? "justify-content-center" : "justify-content-end"} mt-5`}>
                    <Button variant="primary" onClick={() => setModalPaymentShow(true)} size="lg" className="custom-btn-primary fw-bold font-size-18px w-75">Pay</Button>
                  </div>
                </Col>
              )
            }
          </Row>
        </Row>
      </Container>
    </>
  )
}