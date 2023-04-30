import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, Col, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "_helpers";

export { ViewPrescription };

function ViewPrescription({ show, setShow, id }) {
  const baseUrl = `${process.env.REACT_APP_API_URL}/patientrequest`;
  const [prescriptionData, setPrescriptionData] = useState([]);

  const fetchPrescription = async () => {
    const response = await fetchWrapper.get(baseUrl + "?patient=" + id);
    if (response) {
      setPrescriptionData(response);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPrescription();
    }
  }, [id]);

  console.log(prescriptionData);
  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header>
          <b>
            Patient - {prescriptionData[0]?.patient?.first_name}{" "}
            {prescriptionData[0]?.patient?.last_name}
          </b>
        </Modal.Header>
        <Modal.Body>
          {prescriptionData.length > 0 &&
            prescriptionData.map((data) => (
              <Alert variant="secondary">
                <Row className="d-flex justify-content-between">
                  <Col sm="4">
                    <Alert variant="dark">
                      Prescription No. {data.prescription_no}
                    </Alert>
                  </Col>
                  <Col sm="5">
                    <Alert variant="dark">
                      Date:{" "}
                      {moment(data.created_at).format("DD-MM-YYYY h:mm a")}
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
                <p>{data?.prescription_remark}</p>
              </Alert>
            ))}
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
