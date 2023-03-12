import { Toast, Alert } from "react-bootstrap";

export default function SuccessLogoutToast(props) {
  return (
    <Toast onClose={props.onClose} show={props.show} delay={5000} autohide className="position-fixed" style={{ bottom:"1rem", left:"1rem", width:"fit-content", zIndex:"10" }}>
      <Alert key={"secondary"} variant={"secondary"} className="font-size-18px m-0" style={{ width:"fit-content" }}>
        Logout Success!
      </Alert>
    </Toast> 
  )
}