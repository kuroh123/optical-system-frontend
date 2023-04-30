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
import CreatableSelect from "react-select/creatable";
import {
  spherical,
  cylindrical,
  axis,
  lens_types,
  frame_types,
  lens_for,
  lens_side,
  other_items,
} from "_helpers/eye-details";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export { PatientPrescription };

function PatientPrescription() {
  const { patientId } = useParams();
  const [patientData, setPatientdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useRef();
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const prescriptionRequestBaseUrl = `${process.env.REACT_APP_API_URL}/patientrequest`;
  const billRequestBaseUrl = `${process.env.REACT_APP_API_URL}/billing`;

  const [lensType, setLensType] = useState({});
  const [lensFor, setLensFor] = useState({});
  const [lensSide, setLensSide] = useState({});
  const [frameType, setFrameType] = useState({});
  const [otherItems, setOtherItems] = useState([]);
  const [lensExpiry, setLensExpiry] = useState(null);

  //need to add remaining fields and fix the values of select fields
  const billInitialValues = {
    lens_name: "",
    frame_name: "",
    bill_remarks: "",
    lens_price: 0,
    frame_price: 0,
    extra_charges: 0,
    apply_vat_amount: 0,
    vat: 0,
    paid_amount: 0,
    total_amount: 0,
    balance_amount: 0,
  };

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
  const [billValues, setBillValues] = useState(billInitialValues);
  const [eyeValues, setEyeValues] = useState(eyeInitialValues);

  billValues.vat = parseFloat(billValues.apply_vat_amount * 0.05).toFixed(3);
  billValues.total_amount = parseFloat(
    parseFloat(billValues.lens_price) +
      parseFloat(billValues.frame_price) +
      parseFloat(billValues.extra_charges) +
      parseFloat(billValues.vat)
  ).toFixed(3);
  billValues.balance_amount = parseFloat(
    parseFloat(billValues.total_amount) - parseFloat(billValues.paid_amount)
  ).toFixed(3);

  const handleBillInputChange = (e) => {
    const { name, value } = e.target;

    setBillValues({
      ...billValues,
      [name]: value,
    });
  };

  const handleEyeInputChange = (e) => {
    const { name, value } = e.target;

    setEyeValues({
      ...eyeValues,
      [name]: value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(form.current);
    let eyeData = eyeValues;
    let billData = billValues;
    eyeData.patient = patientId;
    billData.patient = patientId;
    billData.lens_type = lensType?.value;
    billData.lens_for = lensFor?.value;
    billData.lens_side = lensSide?.value;
    billData.frame_type = frameType?.value;
    billData.lens_expiry = lensExpiry;
    billData.other_items = otherItems;

    // formData.forEach((value, key) => (object[key] = value));
    console.log(eyeData);
    console.log(billData);
    const prescriptionResponse = await fetchWrapper.post(
      prescriptionRequestBaseUrl,
      eyeData
    );
    const billResponse = await fetchWrapper.post(billRequestBaseUrl, billData);
    if (prescriptionResponse && billResponse) {
      setLoading(false);
      navigate("/billing");
    }
  };

  console.log(otherItems);
  console.log(lensExpiry);

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
          <Row className="d-flex justify-content-around mb-3 mt-4">
            <Col sm="4">
              <Form.Group>
                <Form.Label>Patient</Form.Label>
                <Form.Control
                  name="full_name"
                  type="text"
                  value={`${patientData?.first_name} ${patientData?.last_name} / ${patientData?.gender}`}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Registered At</Form.Label>
                <Form.Control
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
                  className="custom-select custom-select-sm"
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
                  className="custom-select custom-select-sm"
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
                  className="custom-select custom-select-sm"
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
                  className="custom-select custom-select-sm"
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
                  className="custom-select custom-select-sm"
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
                  className="custom-select custom-select-sm"
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

        <div className="my-3">
          <div className="h4 mb-3">Frame/Lens Details</div>
          <Row>
            <Col md="3">
              <label>Lens Type</label>
              <CreatableSelect
                isClearable
                options={lens_types}
                name="lens_type"
                // value={lensType}
                defaultValue={lensType}
                onChange={setLensType}
              />
            </Col>
            <Col md="3">
              <Form.Group>
                <Form.Label>Lens Name</Form.Label>
                <Form.Control
                  name="lens_name"
                  value={billValues.lens_name}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col md="3">
              <label>Lens For</label>
              <CreatableSelect
                isClearable
                options={lens_for}
                name="lens_for"
                value={lensFor}
                onChange={setLensFor}
              />
            </Col>
            <Col md="3">
              <label>Lens Side</label>
              <CreatableSelect
                isClearable
                options={lens_side}
                name="lens_side"
                value={lensSide}
                onChange={setLensSide}
              />
            </Col>
          </Row>
          <Row className="my-3">
            {lensType?.value === "Contact-lens" ? (
              <Col md="3">
                <label>Contact Lens Expiry</label>
                <DatePicker
                  name="lens_expiry"
                  className="form-control"
                  selected={lensExpiry}
                  onChange={(date) => {
                    setLensExpiry(date);
                  }}
                />
              </Col>
            ) : (
              ""
            )}
            <Col md="3">
              <label>Frame Type</label>
              <CreatableSelect
                isClearable
                options={frame_types}
                name="frame_type"
                value={frameType}
                onChange={setFrameType}
              />
            </Col>
            <Col md="3">
              <Form.Group>
                <Form.Label>Frame Name</Form.Label>
                <Form.Control
                  name="frame_name"
                  value={billValues.frame_name}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col md="3">
              <label>Other Items</label>
              <CreatableSelect
                isMulti
                isClearable
                options={other_items}
                name="other_items"
                value={otherItems}
                onChange={setOtherItems}
              />
            </Col>
          </Row>
        </div>
        <hr />
        <div className="my-3">
          <div className="h4 mb-3">Billing Details</div>
          <Row>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Lens Price</Form.Label>
                <Form.Control
                  name="lens_price"
                  type="text"
                  value={billValues.lens_price}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Frame Price</Form.Label>
                <Form.Control
                  name="frame_price"
                  type="text"
                  value={billValues.frame_price}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Extra Charges</Form.Label>
                <Form.Control
                  name="extra_charges"
                  type="text"
                  value={billValues.extra_charges}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm="2">
              <Form.Group>
                <Form.Label className="font-weight-bold">
                  VAT on Amount
                </Form.Label>
                <Form.Control
                  name="apply_vat_amount"
                  type="text"
                  value={billValues.apply_vat_amount}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm="2">
              <Form.Group>
                <Form.Label className="font-weight-bold">VAT (5%)</Form.Label>
                <Form.Control
                  name="vat"
                  type="text"
                  value={billValues.vat}
                  onChange={handleBillInputChange}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col sm="2">
              <Form.Group>
                <Form.Label className="font-weight-bold">
                  Total Amount
                </Form.Label>
                <Form.Control
                  name="total_amount"
                  type="text"
                  value={billValues.total_amount}
                  onChange={handleBillInputChange}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col sm="2">
              <Form.Group>
                <Form.Label className="font-weight-bold">
                  Paid Amount
                </Form.Label>
                <Form.Control
                  name="paid_amount"
                  type="text"
                  value={billValues.paid_amount}
                  onChange={handleBillInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm="2">
              <Form.Group>
                <Form.Label className="font-weight-bold">
                  Balance Amount
                </Form.Label>
                <Form.Control
                  name="balance_amount"
                  type="text"
                  value={billValues.balance_amount}
                  onChange={handleBillInputChange}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="d-flex justify-content-center align-items-center mt-5">
          <Button
            className="d-flex justify-content-center btn btn-success"
            type="submit"
            // disabled={loading}
          >
            Save Prescription
          </Button>
        </div>
      </Container>
    </Form>
  );
}
