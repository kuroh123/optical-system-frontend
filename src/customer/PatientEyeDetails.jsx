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
import {
  spherical,
  cylindrical,
  axis,
  other_items,
} from "_helpers/eye-details";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

export { PatientEyeDetails };

function PatientEyeDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientdata] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useRef();

  //URLS
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const eyeDetailsRequestBaseUrl = `${process.env.REACT_APP_API_URL}/eyeDetails`;

  //need to add remaining fields and fix the values of select fields

  const eyeInitialValues = {
    r_sph: "",
    r_cyl: "",
    r_axis: "",
    r_add: "",
    r_prism: "",
    r_va: "",
    l_sph: "",
    l_cyl: "",
    l_axis: "",
    l_add: "",
    l_prism: "",
    l_va: "",
  };
  const [eyeValues, setEyeValues] = useState(eyeInitialValues);

  const handleEyeInputChange = (e) => {
    const { name, value } = e.target;

    setEyeValues({
      ...eyeValues,
      [name]: value,
    });
  };

  const fetchPatientData = async () => {
    const response = await fetchWrapper.get(baseUrl + "/" + customerId);
    if (response) {
      setPatientdata(response);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchPatientData();
    }
  }, [customerId]);

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(form.current);
    let eyeData = eyeValues;
    eyeData.patient = customerId;

    // formData.forEach((value, key) => (object[key] = value));
    console.log(eyeData);
    const eyeDetailsResponse = await fetchWrapper.post(
      eyeDetailsRequestBaseUrl,
      eyeData,
      "Eye Details has been created!"
    );
    if (eyeDetailsResponse) {
      setLoading(false);
      navigate("/customers");
    }
  };

  return (
    <Container>
      <Form
        ref={form}
        onSubmit={(e) => {
          setLoading(true);
          handleSubmit(e);
        }}
      >
        <Container fluid>
          <h2>Customer Eye Details</h2>
          <hr />
          <Alert key="info" variant="info">
            <Row className="d-flex justify-content-around mb-3 mt-4">
              <Col sm="4">
                <Form.Group>
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="full_name"
                    type="text"
                    value={`${patientData?.first_name} ${
                      patientData?.last_name
                    } / ${patientData?.gender ? patientData.gender : ""}`}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm="4">
                <Form.Group>
                  <Form.Label>Registered At</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="age_gender"
                    type="text"
                    value={moment(patientData?.created_at).format(
                      "DD-MM-YYYY h:mm a"
                    )}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Alert>
          {/* Eye details */}
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
                  <select
                    name="r_sph"
                    className="form-control form-control-sm"
                    value={eyeValues.r_sph}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
                      --spherical--
                    </option>
                    {spherical.map((sph) => (
                      <option>{parseFloat(sph).toFixed(2)}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="r_cyl"
                    className="form-control form-control-sm"
                    value={eyeValues.r_cyl}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
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
                    className="form-control form-control-sm"
                    value={eyeValues.r_axis}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
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
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.r_add}
                    onChange={handleEyeInputChange}
                  />
                </td>
                <td>
                  <input
                    name="r_prism"
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.r_prism}
                    onChange={handleEyeInputChange}
                  />
                </td>
                <td>
                  <input
                    name="r_va"
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.r_va}
                    onChange={handleEyeInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "5%" }} scope="col">
                  L
                </td>
                <td>
                  <select
                    name="l_sph"
                    className="form-control form-control-sm"
                    value={eyeValues.l_sph}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
                      --spherical--
                    </option>
                    {spherical.map((sph) => (
                      <option>{parseFloat(sph).toFixed(2)}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="l_cyl"
                    className="form-control form-control-sm"
                    value={eyeValues.l_cyl}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
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
                    className="form-control form-control-sm"
                    value={eyeValues.l_axis}
                    onChange={handleEyeInputChange}
                  >
                    <option selected value="">
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
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.l_add}
                    onChange={handleEyeInputChange}
                  />
                </td>
                <td>
                  <input
                    name="l_prism"
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.l_prism}
                    onChange={handleEyeInputChange}
                  />
                </td>
                <td>
                  <input
                    name="l_va"
                    autoComplete="off"
                    placeholder="enter value"
                    type="text"
                    className="form-control form-control-sm"
                    value={eyeValues.l_va}
                    onChange={handleEyeInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-center align-items-center mt-5">
            <Button
              className="d-flex justify-content-center btn btn-success"
              type="submit"
              // disabled={loading}
            >
              Save Eye Details
            </Button>
          </div>
        </Container>
      </Form>
    </Container>
  );
}
