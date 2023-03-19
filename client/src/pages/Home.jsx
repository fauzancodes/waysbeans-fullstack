import { Container, Col, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home(props) {
  document.title = "WaysBeans | Best Quality Coffee Beans";
  let Products = [];
  if (props.Products !== undefined) {
    Products = [...props.Products];
    Products.sort((a, b) => b.id - a.id);
  }

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={11} className="custom-margin-top position-relative">
            <div id="title" className="p-5 col-12 col-lg-11 position-relative" style={{ backgroundColor:"#DBB699" }}>
              <img src="/images/cover-title.webp" alt="WaysBeans" style={{ height:"8rem" }}/>
              <h1 className="mt-2 font-size-24px">BEST QUALITY COFFEE BEANS</h1>
              <p className="mt-3 font-size-18px">Quality freshly roasted coffee made just for you.<br/>Pour, brew and enjoy</p>
              <img id="cover-waves" className="position-absolute" style={{ right:"3rem",bottom:"1rem" }} src="/images/cover-waves.webp" alt="Cover Waves"/>
            </div>
            <img id="cover-image" className="position-absolute" src="/images/cover-image.webp" alt="Cover Coffee Cups" style={{ height:"15rem",top:"1rem",right:"0" }}/>
          </Col>
          <Col sm={12} lg={11} className="my-5 d-flex flex-row flex-wrap justify-content-around">
            {
              Products.length > 0 ? (
                Products.map((item) => (
                  <Link to={`/product-details/${item.id}`} key={item.id} className="text-decoration-none mb-5">
                    <Card className="border-0 product-card rounded-0">
                      <Card.Img variant="top" src={item.photo} alt={item.name} className="w-100" style={{ borderRadius:"0", objectFit:"cover", height:"18rem" }} />
                      <Card.Body>
                        <Card.Title className="product-title">{item.name}</Card.Title>
                        <Card.Text className="product-details">
                          <div className="product-details">{item.price.toLocaleString("id-ID", {style: "currency",currency: "IDR"})}</div>
                          <div className="product-details">Stock: {item.stock}</div>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                ))
              ) : <p className={`${props.darkMode && "text-light"} opacity-50`}>There are no products to display.</p>
            }
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;