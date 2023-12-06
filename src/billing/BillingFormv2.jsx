import FormModal from "_components/FormModal";
import { fetchWrapper } from "_helpers";
import { useEffect, useRef, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Accordion,
  Tab,
  Tabs,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";

const BillingFormv2 = ({ modalShow, setModalShow, fetchBilling }) => {
  const productBaseUrl = `${process.env.REACT_APP_API_URL}/product`;
  const patientBaseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const billingBaseUrl = `${process.env.REACT_APP_API_URL}/billing/direct/`;
  const user = useSelector((x) => x.auth.user.user);
  const [key, setKey] = useState("existing_patient");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patientDetailInitial = {
    first_name: "",
    last_name: "",
    mobile: "",
  };
  const [patientDetails, setPatientDetails] = useState(patientDetailInitial);

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;

    setPatientDetails({
      ...patientDetails,
      [name]: value.toUpperCase(),
    });
  };

  const customerOrderInitial = {
    description: "",
    sold_quantity: 1,
    amount: 0,
    remarks: "",
    type: "CUSTOMER_ORDER",
  };
  const [selectedCustomerOrder, setSelectedCustomerOrder] =
    useState(customerOrderInitial);

  const serviceInitial = {
    description: "",
    amount: 0,
    sold_quantity: 1,
    remarks: "",
    type: "SERVICE",
  };
  const [selectedService, setSelectedService] = useState(serviceInitial);

  const handleCustomerOrderInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedCustomerOrder({
      ...selectedCustomerOrder,
      [name]: value,
    });
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedService({
      ...selectedService,
      [name]: value,
    });
  };
  const [discount, setDiscount] = useState(0);
  const [billedItems, setBilledItems] = useState([]);

  const fetchProducts = async (inputValue) => {
    const response = await fetchWrapper.get(
      productBaseUrl + (user.location ? `?location=${user.location?._id}` : "")
    );
    return response;
  };

  const fetchPatients = async (inputValue) => {
    const response = await fetchWrapper.get(patientBaseUrl);
    return response;
  };

  const loadOptions = async (inputValue) => {
    return fetchProducts(inputValue).then((res) => {
      return res
        .filter((i) => !(i.current_quantity <= 0))
        .filter((i) =>
          i.product_name.toLowerCase().includes(inputValue.toLowerCase())
        );
    });
  };

  function handleSelect(data) {
    setSelectedProduct(data);
  }

  const loadPatientOptions = async (inputValue) => {
    return fetchPatients(inputValue).then((res) => {
      return res.filter((i) =>
        i.mobile.toString().toLowerCase().includes(inputValue.toLowerCase())
      );
    });
  };

  function handlePatientSelect(data) {
    setSelectedPatient(data);
  }

  // const handleClear = () => {
  //   setOptions((currentOptions) => currentOptions.filter((currentOption) => !selected.includes(currentOption)));
  //   setSelectedProduct([]);
  // };

  const handleProductAdd = () => {
    const sold_quantity = document.getElementById("sold_quantity").value;
    const vat_applicable = document.getElementById("vat_applicable").checked;
    if (sold_quantity > selectedProduct?.current_quantity) {
      toast.error("Selling qty cannot be more than stock quantity!");
    } else {
      const updatedAddedItem = {
        description: selectedProduct?.product_name,
        product: selectedProduct?._id,
        type: "PRODUCT",
        amount: selectedProduct?.selling_price,
        sold_quantity: sold_quantity,
        vat_applicable: vat_applicable,
      };
      setBilledItems((prevList) => [...prevList, updatedAddedItem]);
      setSelectedProduct(null);
    }
  };

  const handleCustomerOrderAdd = () => {
    if (!selectedCustomerOrder.description) {
      toast.error("Enter product!");
    } else {
      const vat_applicable =
        document.getElementById("COvat_applicable").checked;
      const updatedAddedItem = {
        ...selectedCustomerOrder,
        remarks:
          (vat_applicable ? "VAT Applied!" : "No VAT Applied!") +
          "\n" +
          selectedCustomerOrder.remarks,
        vat_applicable: vat_applicable,
      };
      setBilledItems((prevList) => [...prevList, updatedAddedItem]);
      setSelectedCustomerOrder(customerOrderInitial);
    }
  };

  const handleServiceAdd = () => {
    if (!selectedService.description) {
      toast.error("Enter Service!");
    } else {
      setBilledItems((prevList) => [...prevList, selectedService]);
      setSelectedService(serviceInitial);
    }
  };

  // Calculate the total amount of selected products
  const calculateVat = () => {
    let vat = 0;
    for (let item of billedItems) {
      if (item.vat_applicable) {
        vat += parseFloat(item.amount) * parseInt(item.sold_quantity) * 0.05;
      }
    }
    return vat.toFixed(3);
  };

  const calculateTotalAmount = () => {
    const totalAmount = billedItems.reduce(
      (total, item) =>
        total + parseFloat(item.amount) * parseInt(item.sold_quantity),
      0
    );
    return totalAmount.toFixed(3);
  };

  const calculateGrandTotal = () => {
    const totalAmount = billedItems.reduce(
      (total, item) =>
        total +
        parseFloat(item.amount) * parseInt(item.sold_quantity) +
        (item.vat_applicable
          ? parseFloat(item.amount) * parseInt(item.sold_quantity) * 0.05
          : 0),
      0
    );
    return (totalAmount - parseFloat(discount === "" ? 0 : discount)).toFixed(
      3
    );
  };

  console.log("{product}", selectedProduct);
  console.log("{patient}", selectedPatient);

  console.log("{co}", selectedCustomerOrder);
  console.log("{service}", selectedService);
  console.log("{discount}", discount);

  console.log("[ITEMLIST]", billedItems);

  const cleanupFn = () => {
    setModalShow(false);
    setBilledItems([]);
    setDiscount(0);
    setPatientDetails(patientDetailInitial);
  };

  const handleSubmit = async () => {
    const billingData = {
      items: billedItems,
      total_amount: calculateTotalAmount(),
      vat: calculateVat(),
      discount: discount,
      grand_total: calculateGrandTotal(),
    };
    console.log(billingData, patientDetails);

    const billResponse = await fetchWrapper.post(
      billingBaseUrl + (user.location ? `?location=${user.location?._id}` : ""),
      {
        billingData,
        patientDetails:
          key === "new_patient" ? patientDetails : selectedPatient,
      },
      "Billing has been created!"
    );
    if (billResponse) {
      fetchBilling();
      cleanupFn();
    }
  };

  const columns = [
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Amount (RO)",
      selector: (row) => row.amount,
      wrap: true,
    },
    {
      name: "Sold Qty.",
      selector: (row) => row.sold_quantity,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      wrap: true,
    },
    {
      name: "Remarks",
      selector: (row) =>
        row.remarks || row.remarks === ""
          ? row.remarks
          : row.vat_applicable
          ? "VAT Applied!"
          : "No VAT Applied!",
      wrap: true,
    },
    {
      name: "Delete",
      cell: (row, index) => {
        return (
          <Button
            variant="danger"
            size="sm"
            className="fa fa-trash-o"
            onClick={() => {
              setBilledItems(
                billedItems.filter((item, indexElem) => index != indexElem)
              );
            }}
          />
        );
      },
    },
  ];

  return (
    <FormModal show={modalShow} onHide={cleanupFn} formTitle="New Bill">
      <Container>
        <Form>
          <div className="h4">Patient Details</div>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="existing_patient" title="Existing Patient">
              <Row className="mb-2">
                <Col>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    placeholder="Select Patient"
                    onChange={handlePatientSelect}
                    loadOptions={loadPatientOptions}
                    getOptionLabel={(e) =>
                      e.first_name + " " + e.last_name + " | " + e.mobile
                    }
                    getOptionValue={(e) => e._id}
                    isClearable
                  />
                </Col>
              </Row>
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
                      value={selectedPatient?.first_name}
                      disabled
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
                      value={selectedPatient?.last_name}
                      disabled
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
                      value={selectedPatient?.mobile}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="new_patient" title="New Patient">
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
                      placeholder="Enter first name"
                      onChange={handlePatientInputChange}
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
                      placeholder="Enter last name"
                      onChange={handlePatientInputChange}
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
                      placeholder="Enter mobile"
                      onChange={handlePatientInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
          <div className="my-3">
            <Row>
              <Col md="12">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Add Products</Accordion.Header>
                    <Accordion.Body>
                      <Row className="mb-3">
                        <Col md="12">
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            placeholder="Select Items"
                            onChange={handleSelect}
                            loadOptions={loadOptions}
                            getOptionLabel={(e) =>
                              e.product_code + " | " + e.product_name
                            }
                            getOptionValue={(e) => e._id}
                            isClearable
                          />
                        </Col>
                      </Row>
                      {selectedProduct && (
                        <>
                          <Row className="mb-3">
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                  disabled
                                  autoComplete="off"
                                  type="text"
                                  size="sm"
                                  value={selectedProduct?.product_category}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                  disabled
                                  autoComplete="off"
                                  type="text"
                                  size="sm"
                                  value={selectedProduct?.brand}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Product For</Form.Label>
                                <Form.Control
                                  disabled
                                  autoComplete="off"
                                  type="text"
                                  size="sm"
                                  value={selectedProduct?.product_for}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Stock Qty.</Form.Label>
                                <Form.Control
                                  disabled
                                  autoComplete="off"
                                  type="number"
                                  size="sm"
                                  value={selectedProduct?.current_quantity}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Price (RO)</Form.Label>
                                <Form.Control
                                  disabled
                                  autoComplete="off"
                                  type="number"
                                  size="sm"
                                  value={selectedProduct?.selling_price}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Sold Qty.</Form.Label>
                                <Form.Control
                                  autoComplete="off"
                                  id="sold_quantity"
                                  type="number"
                                  size="sm"
                                  defaultValue={1}
                                  placeholder="Enter quantity"
                                />
                              </Form.Group>
                            </Col>
                            <Col
                              md="3"
                              className="d-flex justify-content-center align-items-end"
                            >
                              <Form.Group>
                                <Form.Check
                                  label="VAT %"
                                  autoComplete="off"
                                  id="vat_applicable"
                                  size="sm"
                                  defaultValue={false}
                                  // onChange={(e) =>
                                  //   (selectedProduct.vat_applicable =
                                  //     e.target.checked)
                                  // }
                                />
                              </Form.Group>
                            </Col>
                            <Col md="3" className="d-flex align-items-end">
                              <Button
                                variant="success"
                                size="sm"
                                className="fa fa-plus"
                                onClick={handleProductAdd}
                              >
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
              <Col className="mt-3">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Customer Order</Accordion.Header>
                    <Accordion.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Product</Form.Label>
                            <Form.Control
                              autoComplete="off"
                              name="description"
                              type="text"
                              size="sm"
                              placeholder="Enter product"
                              value={selectedCustomerOrder.description}
                              onChange={handleCustomerOrderInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              autoComplete="off"
                              name="amount"
                              type="number"
                              size="sm"
                              placeholder="Enter price"
                              value={selectedCustomerOrder.amount}
                              onChange={handleCustomerOrderInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Qty.</Form.Label>
                            <Form.Control
                              autoComplete="off"
                              name="sold_quantity"
                              type="number"
                              size="sm"
                              placeholder="Enter quantity"
                              value={selectedCustomerOrder.sold_quantity}
                              onChange={handleCustomerOrderInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={5}>
                          <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                              as="textarea"
                              autoComplete="off"
                              name="remarks"
                              size="sm"
                              placeholder="Enter remarks"
                              value={selectedCustomerOrder.remarks}
                              onChange={handleCustomerOrderInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={4}
                          className="d-flex justify-content-center align-items-end"
                        >
                          <Form.Group>
                            <Form.Check
                              label="VAT %"
                              autoComplete="off"
                              id="COvat_applicable"
                              size="sm"
                              defaultValue={false}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                          <Button
                            variant="success"
                            size="sm"
                            className="fa fa-plus"
                            onClick={handleCustomerOrderAdd}
                          >
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
              <Col className="mt-3">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Services</Accordion.Header>
                    <Accordion.Body>
                      <Row className="mb-3">
                        <Col md="9">
                          <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              autoComplete="off"
                              name="description"
                              type="text"
                              size="sm"
                              placeholder="Enter service description"
                              value={selectedService.description}
                              onChange={handleServiceInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Cost</Form.Label>
                            <Form.Control
                              autoComplete="off"
                              name="amount"
                              type="number"
                              size="sm"
                              placeholder="Enter cost"
                              value={selectedService.amount}
                              onChange={handleServiceInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={9}>
                          <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                              as="textarea"
                              autoComplete="off"
                              name="remarks"
                              size="sm"
                              placeholder="Enter remarks"
                              value={selectedService.remarks}
                              onChange={handleServiceInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex  align-items-end">
                          <Button
                            variant="success"
                            size="sm"
                            className="fa fa-plus"
                            onClick={handleServiceAdd}
                          >
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            <Row className="my-3">
              <Col>
                <DataTable
                  columns={columns}
                  data={billedItems}
                  dense
                  persistTableHead
                />
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    autoComplete="off"
                    name="totalAmount"
                    size="sm"
                    readOnly
                    value={calculateTotalAmount()}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Total VAT</Form.Label>
                  <Form.Control
                    type="number"
                    autoComplete="off"
                    name="vat"
                    size="sm"
                    readOnly
                    value={calculateVat()}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="number"
                    autoComplete="off"
                    name="vat"
                    size="sm"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Grand Total</Form.Label>
                  <Form.Control
                    type="number"
                    autoComplete="off"
                    name="grandTotal"
                    size="sm"
                    readOnly
                    value={calculateGrandTotal()}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div className="d-flex my-3 justify-content-center">
            <Button
              className="fa fa-save"
              size="sm"
              variant="success"
              onClick={handleSubmit}
            >
              {""} Save & Close
            </Button>
          </div>
        </Form>
      </Container>
    </FormModal>
  );
};

export default BillingFormv2;
