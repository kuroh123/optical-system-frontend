import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "_helpers";

export { RegisterPatient };

function RegisterPatient() {
  const form = useRef();
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;

  // const initialValues = {
  //   first_name: "",
  //   last_name: "",
  //   mobile: "",
  //   examined_by: "",
  //   address: "",
  //   dob: "",
  //   age: 0,
  //   gender: "",
  // };
  // const [values, setValues] = useState(initialValues);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   setValues({
  //     ...values,
  //     [name]: value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const response = await fetchWrapper.post(baseUrl, object);
    if (response) {
      console.log(response);
      navigate("/patient");
    }
  };

  return (
    <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
      <Container fluid>
        <h2>Register Patient</h2>
        <Row className="mb-3 mt-4">
          <Col sm="3">
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control name="first_name" type="text" />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" type="text" />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control name="mobile" type="number" />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Examined By</Form.Label>
              <Form.Control name="examined_by" type="text" />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3 mt-4">
          <Col sm="4">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" type="textarea" />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group>
              <Form.Label>Date Of Birth</Form.Label>
              <Form.Control name="dob" type="date" />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control name="age" type="text" />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control name="gender" type="text" />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Button className="btn btn-success" type="submit">
            Save & Close
          </Button>
        </div>
      </Container>
    </Form>
  );
}
