import FormModal from "_components/FormModal";
import ProductTable from "_components/ProductTable";
import { fetchWrapper } from "_helpers";
import { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";

const BillingForm = ({ modalShow, setModalShow, fetchBilling }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState([]);
  const navigate = useNavigate();

  const productBaseUrl = `${process.env.REACT_APP_API_URL}/product`;
  const billRequestBaseUrl = `${process.env.REACT_APP_API_URL}/billing/direct/`;

  const billInitialValues = {
    total_amount: 0,
    discount: 0,
    extra_charges: 0,
    vat: 0,
    grand_total: 0,
    payment_type: "",
    paid_amount: 0,
    balance_amount: 0,
  };
  const patientInitialData = {
    first_name: "",
    last_name: "",
    mobile: "",
  };

  const [billValues, setBillValues] = useState(billInitialValues);
  const [patientData, setPatientData] = useState(patientInitialData);

  // Billing Calculations
  let total_amount = 0;
  let discount = 0;
  let vat = 0;
  for (let item of selectedOptions) {
    if (item.vat_applicable === "Yes") {
      total_amount += item.selling_price * item.sold_quantity;
      vat += (total_amount - item.discount) * 0.05;
      // vat += item_vat;
      discount += item.discount;
    } else {
      total_amount += item.selling_price * item.sold_quantity;
      discount += item.discount;
    }
  }
  billValues.total_amount = parseFloat(total_amount).toFixed(3);
  billValues.discount = parseFloat(discount).toFixed(3);
  billValues.vat = parseFloat(vat).toFixed(3);
  // billValues.vat = parseFloat(vat).toFixed(3);
  billValues.grand_total = parseFloat(
    parseFloat(billValues.total_amount) +
      parseFloat(billValues.extra_charges) +
      parseFloat(billValues.vat) -
      parseFloat(billValues.discount)
  ).toFixed(3);
  billValues.balance_amount = parseFloat(
    parseFloat(billValues.grand_total) - parseFloat(billValues.paid_amount)
  ).toFixed(3);

  const handleBillInputChange = (e) => {
    const { name, value } = e.target;

    setBillValues({
      ...billValues,
      [name]: value,
    });
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;

    setPatientData({
      ...patientData,
      [name]: value.toUpperCase(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(form.current);
    let billData = billValues;

    let product_values = [];
    for (let item of selectedOptions) {
      product_values.push({
        product: item._id,
        sold_quantity: item.sold_quantity,
      });
    }
    billData.product_details = product_values;

    // formData.forEach((value, key) => (object[key] = value));
    console.log(billData);
    const billResponse = await fetchWrapper.post(
      billRequestBaseUrl,
      { billData: billData, patientData: patientData },
      "Billing has been created!"
    );
    if (billResponse) {
      setLoading(false);
      fetchBilling();
      cleanupFn();
    }
  };

  function handleSelect(data) {
    setSelectedOptions(data);
  }

  // load products list
  const fetchProducts = async (inputValue) => {
    const response = await fetchWrapper.get(productBaseUrl);
    return response;
  };

  const loadOptions = async (inputValue) => {
    return fetchProducts(inputValue).then((res) => {
      return res.filter((i) =>
        i.product_name.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
  };

  console.log(selectedOptions);

  const cleanupFn = () => {
    setModalShow(false);
    setSelectedOptions([]);
    setBillValues(billInitialValues);
    setPatientData(patientInitialData);
  };

  console.log(patientData.first_name);

  return (
    <FormModal show={modalShow} onHide={cleanupFn} formTitle="New Bill">
      <Container>
        <Form onSubmit={handleSubmit}>
          <div className="h4">Patient Details</div>
          <Row>
            <Col md={4} className="mb-2">
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  autoComplete="off"
                  required
                  size="sm"
                  name="first_name"
                  type="text"
                  value={patientData.first_name}
                  onChange={handlePatientInputChange}
                  placeholder="Enter first name"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-2">
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="last_name"
                  type="text"
                  size="sm"
                  value={patientData.last_name}
                  onChange={handlePatientInputChange}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-2">
              <Form.Group>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="mobile"
                  type="number"
                  size="sm"
                  // value={patientData.last_name}
                  onChange={handlePatientInputChange}
                  placeholder="Enter mobile"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="my-3">
            <div className="h4 mb-3">Select Items</div>
            <Row>
              <Col>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="Select Items"
                  // value={selectedOptions}
                  onChange={handleSelect}
                  loadOptions={loadOptions}
                  getOptionLabel={(e) =>
                    e.product_name + ", " + e.product_category
                  }
                  getOptionValue={(e) => e._id}
                  isMulti
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <ProductTable
                  data={selectedOptions}
                  setData={setSelectedOptions}
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
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="total_amount"
                    size="sm"
                    type="text"
                    value={billValues.total_amount}
                    onChange={handleBillInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label>Extra Charges</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="extra_charges"
                    size="sm"
                    type="text"
                    value={billValues.extra_charges}
                    onChange={handleBillInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="discount"
                    size="sm"
                    type="number"
                    value={billValues.discount}
                    onChange={handleBillInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label className="font-weight-bold">VAT</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="vat"
                    type="text"
                    size="sm"
                    value={billValues.vat}
                    onChange={handleBillInputChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col sm="3">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Grand Total
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="grand_total"
                    type="text"
                    size="sm"
                    value={billValues.grand_total}
                    onChange={handleBillInputChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    size="sm"
                    as="select"
                    name="payment_type"
                    required
                    value={billValues.payment_type}
                    onChange={handleBillInputChange}
                  >
                    <option selected disabled value="">
                      select
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="Visa">Visa</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Paid Amount
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="paid_amount"
                    type="text"
                    size="sm"
                    value={billValues.paid_amount}
                    onChange={handleBillInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm="3">
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    Balance Amount
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="balance_amount"
                    type="text"
                    size="sm"
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
              Save Billing
            </Button>
          </div>
        </Form>
      </Container>
    </FormModal>
  );
};

export default BillingForm;
