import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import { API } from '../config/api';

export default function Profile(props) {
  document.title = `My Profile | WaysBeans`;
  const navigate = useNavigate();
  console.log(props.Transactions)

  async function UpdateProfile(id) {
    try {
      const responseProfile = await API.get('/profile/' + id);
      if (responseProfile.data.data.photo !== "") {
        props.setImageUrl(responseProfile.data.data.photo);
      }
  
      props.setformUpdateProfile({
        ...props.formUpdateProfile,
        id: responseProfile.data.data.id,
        phone: responseProfile.data.data.phone,
        address: responseProfile.data.data.address,
      });
    }
    catch (error) {
      return
    }

    navigate('/update-profile');
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      <Container>
        <Row className="custom-margin-top mx-5 responsive-margin-x justify-content-between">
          <Col xs={12} lg={6} className="mb-5 animate__animated animate__slideInLeft">
            <h2 className="product-title mb-4 font-size-24px">My Profile</h2>
            <div className="d-flex flex-wrap align-items-start">
              <img onClick={() => UpdateProfile(props.User.id)} id="profile-picture" src={
                props.Profiles.find(profile => profile.user_id === props.User.id).photo === "" ? "/images/profile-picture-placeholder.webp" : props.Profiles.find(profile => profile.user_id === props.User.id).photo
              } alt="Profile" className="rounded me-4 mb-4" style={{ width:"11rem", height:"14rem", objectFit:"cover", cursor:"pointer" }}/>
              <input type="file" id="profile-picture-file" className="d-none"></input>
              <div>
                <h5 className="product-title font-size-18px">Full Name</h5>
                <div className="font-size-18px mb-4">{props.User.name}</div>
                <h5 className="product-title font-size-18px">Email</h5>
                <div className="font-size-18px mb-4">{props.User.email}</div>
                {
                  props.Profiles.find(profile => profile.user_id === props.User.id)?.phone !== "" ? (
                    <>
                      <h5 className="product-title font-size-18px">Phone</h5>
                      <div className="font-size-18px mb-4">{props.Profiles.find(profile => profile.user_id === props.User.id)?.phone}</div>
                    </>
                  ) : null
                }
                {
                  props.Profiles.find(profile => profile.user_id === props.User.id)?.address !== "" ? (
                    <>
                      <h5 className="product-title font-size-18px">Address</h5>
                      <div className="font-size-18px mb-4">{props.Profiles.find(profile => profile.user_id === props.User.id)?.address}</div>
                    </>
                  ) : null
                }
              </div>
            </div>
          </Col>
          <Col xs={12} lg={6} className="animate__animated animate__slideInRight">
            <h2 className="product-title mb-4 font-size-24px">My Transaction</h2>
            {
              props.Transactions.filter(transaction => transaction.user?.id === props.User.id).length > 0 ? (
                props.Transactions.filter(transaction => transaction.user?.id === props.User.id).map((item) => (
                  <Row key={item.id} className="justify-content-between align-items-center p-3 mb-4" style={{ backgroundColor:"#F6E6DA" }}>
                    <Col xs={12} className="d-flex flex-wrap justify-content-center align-items-center product-transaction">
                      {
                        item.products?.map((product, index) => (
                          index % 2 === 0 ? (
                            <div className="d-flex flex-column align-items-center mx-2">
                              <img src={product?.product_photo} alt={product?.product_name} className="mt-3" style={{ width:"6.75rem", height:"9rem", objectFit:"cover" }}/>
                              <h3 className="product-title font-size-16px mt-0 mb-3">{product?.product_name}</h3>
                            </div>
                          ) : null
                        ))
                      }
                    </Col>
                    <Col xs={12} lg={8} className="d-flex flex-wrap justify-content-center align-items-center product-transaction">
                      <div className="w-100">
                        <p className="custom-text-primary font-size-14px"><strong className="custom-text-primary">{`${new Date(item.date).getDate()} ${months[new Date(item.date).getMonth()]} ${new Date(item.date).getFullYear()}`}</strong></p>
                        <p className="product-details font-size-14px mb-0">Price : Rp{item.total_price}</p>
                        <p className="product-details font-size-14px mb-0">Qty : {item.total_quantity}</p>
                        <p className="product-details font-size-14px fw-bold mb-0">Sub Total : Rp{item.total_price}</p>
                      </div>
                    </Col>
                    <Col xs={12} lg={4} className="d-flex flex-column align-items-center">
                      <img src="/images/icon-logo.webp" alt="Logo" style={{ width:"6rem" }}/>
                      <img src="/images/qr-code.webp" alt="QR Code" className="my-3" style={{ width:"4rem" }}/>
                      {
                        item.status === "pending" ? (
                          <div className="font-size-14px text-center rounded py-1" style={{ width:"100%",color:"#FF9900",backgroundColor:"rgba(255,153,0,0.125)" }}>{item.status}</div>
                        ) : null
                      }
                      {
                        item.status === "success" ? (
                          <div className="font-size-14px text-center rounded py-1" style={{ width:"100%",color:"#78A85A",backgroundColor:"rgba(120,168,90,0.125)" }}>{item.status}</div>
                        ) : null
                      }
                      {
                        item.status === "failed" ? (
                          <div className="font-size-14px text-center rounded py-1" style={{ width:"100%",color:"#E83939",backgroundColor:"#F5AFAF" }}>{item.status}</div>
                        ) : null
                      }
                    </Col>
                  </Row>
                ))
              ) : <p className="opacity-50">You have never made any transaction.</p>
            }
          </Col>
        </Row>
      </Container>
    </>
  )
}