import { Button, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const FormModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <div className="modalCrossBtn position-absolute cursor-pointer">
          <AiOutlineClose size={20} onClick={props.onHide} />
        </div>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.formTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      {/* <Modal.Footer>
        <Button variant="danger" size="sm" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default FormModal;
