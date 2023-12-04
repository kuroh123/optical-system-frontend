import FormModal from "_components/FormModal";
import { fetchWrapper } from "_helpers";
import { customStyles } from "_helpers/tableCustomStyle";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import ReactSelect from "react-select";

const CustomerOrders = () => {
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients/customerOrders`;
  const [customerOrders, setCustomerOrders] = useState([]);
  // const [customerOrderId, setCustomerOrderId] = useState("");
  const [currentCustomerOrder, setCurrentCustomerOrder] = useState(null);
  // const [values, setValues] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const editForm = useRef();

  const [filter, setFilter] = useState({
    description: "",
    status: "",
    list: [],
  });
  const status = [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
  ];

  const fetchCustomerOrders = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setCustomerOrders(response);
      setFilter({ list: response });
    }
  };
  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const columns = [
    {
      name: "Order No.",
      selector: (row) => row.customer_order_no,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Amount (Qty)",
      selector: (row) => `${row.amount} (${row.sold_quantity})`,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Order Date",
      selector: (row) => moment(row?.created_at).format("DD-MM-YYYY h:mm a"),
    },
    {
      name: "Actions",
      selector: null,
      cell: (row, index) => (
        <div>
          <Button
            className="btn-warning fa fa-edit"
            size="sm"
            onClick={(e) => {
              setModalShow(true);
              setCurrentCustomerOrder(row);
            }}
            id={row._id}
          />
          {row.status === "pending" ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip">Mark as received?</Tooltip>}
            >
              <Button
                className="mx-2 btn-success fa fa-check-square-o"
                size="sm"
                onClick={(e) => handleStatusUpdate(row._id)}
                id={row._id}
              />
            </OverlayTrigger>
          ) : (
            <Button
              className="mx-2 btn-secondary fa fa-check-square-o"
              size="sm"
              disabled
              id={row._id}
            />
          )}
        </div>
      ),
    },
  ];

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const response = await fetchWrapper.put(
      `${baseUrl}/${currentCustomerOrder?._id}`,
      object
    );
    if (response) {
      cleanupFn();
    }
  };

  const handleStatusUpdate = async (id) => {
    const response = await fetchWrapper.put(
      baseUrl + "/" + id,
      { status: "received" },
      "Status updated!"
    );
    console.log(response);
    if (response) {
      fetchCustomerOrders();
    }
  };

  const cleanupFn = () => {
    setModalShow(false);
    setCurrentCustomerOrder(null);
    fetchCustomerOrders();
  };

  const filterDescription = (e) => {
    const results = customerOrders.filter((item) => {
      if (e.target.value === "") return customerOrders;
      return item.description
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilter({
      description: e.target.value,
      list: results,
    });
  };

  const filterStatus = (e) => {
    console.log(e);
    const results = customerOrders.filter((item) => {
      if (!e || e.value === "") return customerOrders;
      return item.status.toString() === e?.value;
    });
    setFilter({
      status: e?.value,
      list: results,
    });
  };

  return (
    <Container>
      <Form>
        <Row className="mb-3 mt-4">
          <Col sm="3">
            <Form.Group>
              <Form.Label>Search Description</Form.Label>
              <Form.Control
                autoComplete="off"
                name="description"
                placeholder="Enter Description"
                size="sm"
                type="search"
                value={filter.description}
                onChange={filterDescription}
              />
            </Form.Group>
          </Col>
          <Col sm="2" className="ms-auto mb-1">
            <div className="form-group">
              <div className="form-control-sm">
                <label>Status</label>
                <ReactSelect
                  name="status"
                  options={status}
                  setValue={filter.status}
                  onChange={filterStatus}
                  isClearable
                />
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      <FormModal
        show={modalShow}
        onHide={cleanupFn}
        formTitle="Edit Customer Order"
      >
        <form ref={editForm} onSubmit={handleEdit}>
          <Row className="mb-3">
            <Col sm="3">
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="product_code"
                  placeholder="Enter product code"
                  size="sm"
                  defaultValue={currentCustomerOrder?.product_code}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="description"
                  placeholder="Enter Description"
                  size="sm"
                  defaultValue={currentCustomerOrder?.description}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="brand"
                  placeholder="Enter brand"
                  size="sm"
                  defaultValue={currentCustomerOrder?.brand}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="remarks"
                  placeholder="Enter remark"
                  size="sm"
                  defaultValue={currentCustomerOrder?.remarks}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="vendor_name"
                  placeholder="Enter vendor name"
                  size="sm"
                  defaultValue={currentCustomerOrder?.vendor_name}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Vendor Contact</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name="vendor_mobile"
                  placeholder="Enter vendor contact"
                  size="sm"
                  defaultValue={currentCustomerOrder?.vendor_mobile}
                />
              </Form.Group>
            </Col>
            <Col sm="6" className="d-flex justify-content-end align-items-end">
              <Button variant="success" size="sm" type="submit">
                Save & Close
              </Button>
            </Col>
          </Row>
        </form>
      </FormModal>
      <DataTable
        data={filter.list}
        columns={columns}
        customStyles={customStyles}
        dense
        responsive
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        progressComponent={
          <div className="py-5">
            <Spinner className="my-5" animation="border" variant="primary" />
          </div>
        }
      />
    </Container>
  );
};

export default CustomerOrders;
