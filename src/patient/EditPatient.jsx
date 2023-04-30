import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import { gender } from "_helpers/eye-details";
import moment from "moment/moment";

export { EditPatient };

function EditPatient() {
  const { patientId } = useParams();
  const form = useRef();
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const [values, setValues] = useState([]);

  const fetchPatientData = async () => {
    const response = await fetchWrapper.get(baseUrl + "/" + patientId);
    if (response) {
      setValues(response);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const response = await fetchWrapper.put(baseUrl + "/" + patientId, object);
    if (response) {
      console.log(response);
      navigate("/patient");
    }
  };

  return (
    <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
      <Container fluid>
        <h2 className="text-center">Edit Patient</h2>
        <Row className="mb-3 mt-4">
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="first_name"
                size="sm"
                type="text"
                value={values.first_name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="last_name"
                size="sm"
                type="text"
                value={values.last_name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                name="mobile"
                size="sm"
                type="number"
                value={values.mobile}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Examined By</Form.Label>
              <Form.Control
                name="examined_by"
                size="sm"
                type="text"
                value={values.examined_by}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                size="sm"
                type="textarea"
                value={values.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {/* <Col sm="4">
            <Form.Group>
              <Form.Label>Date Of Birth</Form.Label>
              <Form.Control
                name="dob"
                type="date"
                value={moment(values.dob).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                name="age"
                type="text"
                value={values.age}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col> */}
          <Col md={{ span: 6, offset: 3 }}>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <select
                className="form-control form-control-sm"
                name="gender"
                type="select"
                value={values.gender}
                onChange={handleInputChange}
              >
                <option selected disabled>
                  Select Gender
                </option>
                {gender.map((elem) => (
                  <option value={elem.value}>{elem.label}</option>
                ))}
              </select>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Button className="btn btn-success" type="submit">
            Update Entry
          </Button>
        </div>
      </Container>
    </Form>
  );
}
