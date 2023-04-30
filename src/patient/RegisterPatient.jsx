import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import Select from "react-select";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { gender } from "_helpers/eye-details";

export { RegisterPatient };

function RegisterPatient() {
  const form = useRef();
  const navigate = useNavigate();
  // const [selectedDate, setSelectedDate] = useState(null);
  // const [age, setAge] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;

  // function getAge(date) {
  //   var today = new Date();
  //   var birthDate = new Date(date);
  //   var age = today.getFullYear() - birthDate.getFullYear();
  //   var m = today.getMonth() - birthDate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   setAge(age);
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const response = await fetchWrapper.post(
      baseUrl,
      object,
      "patient has been created!"
    );
    if (response) {
      console.log(response);
      navigate("/patient");
    }
  };

  return (
    <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
      <Container fluid>
        <h2 className="text-center">Register Patient</h2>
        <Row className="mb-3 mt-4">
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                size="sm"
                name="first_name"
                type="text"
                value={firstName.toUpperCase()}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="last_name"
                type="text"
                size="sm"
                value={lastName.toUpperCase()}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 6, offset: 3 }} className="mb-2">
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                required
                size="sm"
                name="mobile"
                type="number"
                placeholder="Enter Mobile no."
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
                placeholder="Examined By"
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
                placeholder="Enter Address"
              />
            </Form.Group>
          </Col>
          {/* <Col sm="4">
            <div className="form-group">
              <label>DOB</label>
              <DatePicker
                name="dob"
                className="form-control"
                selected={selectedDate}
                onChange={(date) => {
                  getAge(date);
                  setSelectedDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date"
              />
            </div>
          </Col>
          <Col sm="2">
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                name="age"
                value={age}
                type="text"
                onChange={(e) => setAge(e.target.value)}
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
            Save & Close
          </Button>
        </div>
      </Container>
    </Form>
  );
}
