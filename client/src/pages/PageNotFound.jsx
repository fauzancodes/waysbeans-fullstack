import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function PageNotFound() {
  document.title = "Page Not Found | WaysBeans";

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={11} className="custom-margin-top position-relative">
            <div id="title" className="p-5 col-12 col-lg-11 position-relative" style={{ backgroundColor:"#DBB699" }}>
              <img src="/images/cover-title.webp" alt="WaysBeans" style={{ height:"8rem" }}/>
              <h1 className="mt-2 font-size-24px">404. Page Not Found</h1>
              <p className="mt-3 font-size-18px">Sorry, the page you are visiting is not available.<br/>Please return to the <Link to="/">home page</Link>.</p>
              <img id="cover-waves" className="position-absolute" style={{ right:"3rem",bottom:"1rem" }} src="/images/cover-waves.webp" alt="Cover Waves"/>
            </div>
            <img id="cover-image" className="position-absolute" src="/images/cover-image.webp" alt="Cover Coffee Cups" style={{ height:"15rem",top:"1rem",right:"0" }}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PageNotFound;