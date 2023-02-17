import React, { useEffect, useState } from "react";
import { Alert, Col, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "_helpers";

export { ViewPrescription };

function ViewPrescription({ show, setShow, id }) {
  const baseUrl = `${process.env.REACT_APP_API_URL}/patientrequest`;
  const [data, setData] = useState(null);

  const fetchPrescription = async () => {
    const response = await fetchWrapper.get(baseUrl + "/" + id);
    if (response) {
      setData(response);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPrescription();
    }
  }, [id]);

  console.log(data);
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header>
          <Modal.Title>
            Prescription Details For Visit No - {data?.visit_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm="4">
              <Alert variant="warning">
                <strong>Total Bill: </strong>
                {data?.total_amount}
              </Alert>
            </Col>
            <Col sm="4">
              <Alert variant="warning">
                <strong>Extra Charges: </strong>
                {data?.extra_charges}
              </Alert>
            </Col>
            <Col sm="4">
              <Alert variant="warning">
                <strong>Paid Amount: </strong>
                {data?.paid_amount}
              </Alert>
            </Col>
          </Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>SPH.</th>
                <th>CYL.</th>
                <th>AXIS</th>
                <th>ADD</th>
                <th>PRISM</th>
                <th>V.A.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-weight-bold">R</td>
                <td>{data?.right_eye.spherical}</td>
                <td>{data?.right_eye.cylindrical}</td>
                <td>{data?.right_eye.axis}</td>
                <td>{data?.right_eye.add}</td>
                <td>{data?.right_eye.prism}</td>
                <td>{data?.right_eye.va}</td>
              </tr>
              <tr>
                <td className="font-weight-bold">L</td>
                <td>{data?.left_eye.spherical}</td>
                <td>{data?.left_eye.cylindrical}</td>
                <td>{data?.left_eye.axis}</td>
                <td>{data?.left_eye.add}</td>
                <td>{data?.left_eye.prism}</td>
                <td>{data?.left_eye.va}</td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col sm="4">
              <Alert variant="info">
                <strong>Frame Price: </strong>
                {data?.frame_price}
              </Alert>
            </Col>
            <Col sm="4">
              <Alert variant="info">
                <strong>Frame Type: </strong>
                {data?.frame_type}
              </Alert>
            </Col>
            <Col sm="4">
              <Alert variant="info">
                <strong>Frame Price: </strong>
                {data?.frame_price}
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <Alert variant="primary">
                <strong>Lens Price: </strong>
                {data?.lens_price}
              </Alert>
            </Col>
            <Col sm="4">
              <Alert variant="primary">
                <strong>Lens For: </strong>
                {data?.lens_for}
              </Alert>
            </Col>
            <Col sm="3">
              <Alert variant="primary">
                <strong>Lens Type: </strong>
                {data?.lens_type}
              </Alert>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
