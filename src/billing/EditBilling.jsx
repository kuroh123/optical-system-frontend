import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { gender } from "_helpers/eye-details";

export { EditBilling };
function EditBilling() {
  const { billingId } = useParams();
  const baseUrl = `${process.env.REACT_APP_API_URL}/billing`;
  const [loading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const form = useRef();
  const billInitialValues = {
    lens_price: 0,
    frame_price: 0,
    extra_charges: 0,
    apply_vat_amount: 0,
    vat: 0,
    paid_amount: 0,
    total_amount: 0,
    balance_amount: 0,
  };
  const [billValues, setBillValues] = useState(billInitialValues);

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

  const fetchBilling = async () => {
    const response = fetchWrapper(baseUrl + "/" + billingId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
      <Container>
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
            <Col sm="3">
              <label>Bill Remarks</label>
              <textarea
                className="form-control"
                name="bill_remarks"
                type="textarea"
                rows="2"
                cols="20"
                value={billValues.bill_remarks}
                onChange={handleBillInputChange}
              />
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
            disabled={loading}
          >
            Save Prescription
          </Button>
        </div>
      </Container>
    </Form>
  );
}
