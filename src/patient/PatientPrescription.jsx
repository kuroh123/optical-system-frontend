import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import Select from "react-select";
import { spherical, cylindrical, axis } from "_helpers/eye-details";

export { PatientPrescription };

function PatientPrescription() {
  const { patientId } = useParams();
  const [patientData, setPatientdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useRef();
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const requestBaseUrl = `${process.env.REACT_APP_API_URL}/patientrequest`;

  //need to add remaining fields and fix the values of select fields
  const initialValues = {
    lens_price: 0,
    frame_price: 0,
    extra_charges: 0,
    paid_amount: 0,
    total_amount: 0,
  };
  const [values, setValues] = useState(initialValues);

  values.total_amount =
    parseInt(values.lens_price) +
    parseInt(values.frame_price) +
    parseInt(values.extra_charges);

  const fetchPatientData = async () => {
    const response = await fetchWrapper.get(baseUrl + "/" + patientId);
    if (response) {
      setPatientdata(response);
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
    object.patient = patientId;
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const response = await fetchWrapper.post(requestBaseUrl, object);
    if (response) {
      setLoading(false);
      navigate("/prescription");
    }
  };

  return (
    <Form
      ref={form}
      onSubmit={(e) => {
        setLoading(true);
        handleSubmit(e);
      }}
    >
      <Container fluid>
        <h2>Patient Prescription</h2>
        <hr />
        <Alert key="info" variant="info">
          <Row className="mb-3 mt-4">
            <Col sm="4">
              <Form.Group>
                <Form.Label>Patient name</Form.Label>
                <Form.Control
                  name="full_name"
                  type="text"
                  value={`${patientData?.first_name} ${patientData?.last_name}`}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Age/Gender</Form.Label>
                <Form.Control
                  name="age_gender"
                  type="text"
                  value={`${patientData?.age}/${patientData?.gender}`}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Alert>

        <table
          className="table table-striped table-sm table-bordered"
          style={{ width: "100%" }}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">EYE</th>
              <th scope="col">SPH.</th>
              <th scope="col">CYL.</th>
              <th scope="col">AXIS</th>
              <th scope="col">ADD.</th>
              <th scope="col">PRISM</th>
              <th scope="col">V.A.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "5%" }} scope="col">
                R
              </td>
              <td>
                <select name="r_sph" className="custom-select custom-select-sm">
                  <option disabled selected>
                    --spherical--
                  </option>
                  {spherical.map((sph) => (
                    <option>{parseFloat(sph).toFixed(2)}</option>
                  ))}
                </select>
              </td>
              <td>
                <select name="r_cyl" className="custom-select custom-select-sm">
                  <option disabled selected>
                    --cylindrical--
                  </option>
                  {cylindrical.map((cyl) => (
                    <option>{parseFloat(cyl).toFixed(2)}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="r_axis"
                  className="custom-select custom-select-sm"
                >
                  <option disabled selected>
                    --axis--
                  </option>
                  {axis.map((axs) => (
                    <option>{axs}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  name="r_add"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  name="r_prism"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  name="r_va"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
            </tr>
            <tr>
              <td style={{ width: "5%" }} scope="col">
                L
              </td>
              <td>
                <select name="l_sph" className="custom-select custom-select-sm">
                  <option disabled selected>
                    --spherical--
                  </option>
                  {spherical.map((sph) => (
                    <option>{parseFloat(sph).toFixed(2)}</option>
                  ))}
                </select>
              </td>
              <td>
                <select name="l_cyl" className="custom-select custom-select-sm">
                  <option disabled selected>
                    --cylindrical--
                  </option>
                  {cylindrical.map((cyl) => (
                    <option>{parseFloat(cyl).toFixed(2)}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="l_axis"
                  className="custom-select custom-select-sm"
                >
                  <option disabled selected>
                    --axis--
                  </option>
                  {axis.map((axs) => (
                    <option>{axs}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  name="l_add"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  name="l_prism"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  name="l_va"
                  placeholder="enter value"
                  type="text"
                  className="form-control form-control-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Row>
          <Col lg="6">
            <div className="border-right">
              <Row>
                <Col className="d-flex justify-content-center" sm="12">
                  <div className="h3">Eye Details</div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <label>Lens Type</label>
                  <select
                    name="lens_type"
                    className="custom-select custom-select-sm"
                  >
                    <option selected></option>
                    <option value="glass">Glass</option>
                  </select>
                </Col>
                <Col md="3">
                  <label>Lens For</label>
                  <select
                    name="lens_for"
                    className="custom-select custom-select-sm"
                  >
                    <option selected></option>
                    <option value="distance">Distance</option>
                    <option value="near">Near</option>
                    <option value="bfocal">Bfocal</option>
                  </select>
                </Col>
                <Col md="4">
                  <label>Lens Side</label>
                  <select
                    name="lens_side"
                    className="custom-select custom-select-sm"
                  >
                    <option selected></option>
                    <option value="both">Both</option>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="4">
                  <label>Frame Type</label>
                  <select
                    name="frame_type"
                    className="custom-select custom-select-sm"
                  >
                    <option selected></option>
                    <option value="RIMLESS">RIMLESS</option>
                    <option value="FULL-FRAME">FULL-FRAME</option>
                    <option value="SUPRA">SUPRA</option>
                    <option value="POLY-C">POLY-C</option>
                    <option value="GOGGLE">GOGGLE</option>
                    <option value="INDIAN">INDIAN</option>
                    <option value="SHEET">SHEET</option>
                  </select>
                </Col>
                <Col sm="6">
                  <label>Remarks</label>
                  <textarea
                    className="form-control"
                    size="sm"
                    name="remarks"
                    type="textarea"
                    rows="3"
                    cols="30"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="6">
            <div>
              <Row>
                <Col className="d-flex justify-content-center" sm="12">
                  <div className="h3">Billing Details</div>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <Form.Group>
                    <Form.Label>Lens Price</Form.Label>
                    <Form.Control
                      size="sm"
                      name="lens_price"
                      type="text"
                      value={values.lens_price}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col sm="4">
                  <Form.Group>
                    <Form.Label>Frame Price</Form.Label>
                    <Form.Control
                      size="sm"
                      name="frame_price"
                      type="text"
                      value={values.frame_price}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col sm="3">
                  <Form.Group>
                    <Form.Label>Extra Charges</Form.Label>
                    <Form.Control
                      size="sm"
                      name="extra_charges"
                      type="text"
                      value={values.extra_charges}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3 justify-content-md-center">
                <Col sm="4">
                  <Form.Group>
                    <Form.Label className="font-weight-bold">
                      Total Amount
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      name="total_amount"
                      type="text"
                      value={values.total_amount}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col sm="4">
                  <Form.Group>
                    <Form.Label className="font-weight-bold">
                      Paid Amount
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      name="paid_amount"
                      type="text"
                      value={values.paid_amount}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-center align-items-center mt-5">
          <Button
            className="d-flex justify-content-center btn btn-success"
            type="submit"
            disabled={loading}
          >
            Save Prescription
          </Button>
        </div>
      </Container>
    </Form>
  );
}
