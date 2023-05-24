import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { gender } from "_helpers/eye-details";
import DataTable from "react-data-table-component";
import FormModal from "_components/FormModal";
import moment from "moment";

export { ProductMaster };

function ProductMaster() {
  const form = useRef();
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/product`;
  const [modalShow, setModalShow] = useState(false);
  const [delShow, setDelShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [values, setValues] = useState(null);
  const [productId, setProductId] = useState("");
  const [supplierCost, setSupplierCost] = useState(0);
  const [sellingCost, setSellingCost] = useState(0);
  const [vat, setVat] = useState(false);
  const today = new Date();
  // const [startDateTime, setStartDateTime] = useState(
  //   moment(today).format("YYYY-MM-DDT00:00:00Z")
  // );
  // const [endDateTime, setEndDateTime] = useState(
  //   moment(today).format("YYYY-MM-DDTHH:mm:ssZ")
  // );

  const [filter, setFilter] = useState({
    productName: "",
    list: [],
  });

  const columns = [
    {
      name: "S. no.",
      selector: (row) => row?.product_no,
      sortable: true,
      width: "65px",
    },
    {
      name: "Code ",
      selector: (row) => row?.product_code,
      sortable: true,
    },
    {
      name: "Product name",
      selector: (row) => row?.product_name,
      wrap: true,
    },
    {
      name: "Brand",
      selector: (row) => row?.brand,
      wrap: true,
    },
    {
      name: "Category",
      selector: (row) => row?.product_category,
    },
    {
      name: "Product for",
      selector: (row) => row?.product_for,
    },
    {
      name: "Description",
      selector: (row) => row?.description,
      wrap: true,
    },
    {
      name: "Selling Price",
      selector: (row) => row?.selling_price,
      sortable: true,
    },
    {
      name: "Stocked on",
      selector: (row) => moment(row?.created_at).format("DD-MM-YYYY h:mm a"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Ordered qty",
      selector: (row) => row?.ordered_quantity,
      width: "90px",
    },
    {
      name: "Current qty",
      selector: (row) => row.current_quantity,
      width: "90px",
    },
    {
      name: "Actions",
      selector: null,
      cell: (row, index) => (
        <div className="d-flex">
          {/* <Button
            className="btn-success fa fa-eye"
            size="sm"
            as={Link}
            to={`/patient/${row._id}`}
            id={row._id}
          /> */}
          <Button
            className="ml-3 btn-warning fa fa-edit"
            size="sm"
            onClick={(e) => handleEdit(e, row._id)}
            id={row._id}
          />
          <Button
            className="ml-3 btn-danger fa fa-trash"
            size="sm"
            onClick={() => {
              setProductId(row._id);
              setDelShow(true);
            }}
            id={row._id}
          />
        </div>
      ),
    },
  ];
  const customStyles = {
    rows: {
      style: {
        minHeight: "50px",
      },
    },
    headCells: {
      style: {
        fontWeight: "bold",
        padding: "7px",
        border: "1px solid #eee",
        color: "#fff",
        borderBottom: "1px solid #999",
        backgroundColor: "#587acb",
      },
    },
    cells: {
      style: {
        borderLeft: "1px solid #eee",
        borderRight: "1px solid #eee",
        minHeight: "30px",
      },
    },
  };

  const fetchProducts = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setProducts(response);
      setFilter({ list: response });
    }
  };

  const filterProductName = (e) => {
    const results = products.filter((prod) => {
      if (e.target.value === "") return products;
      return prod.product_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilter({
      productName: e.target.value,
      list: results,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    object.vat_applicable = vat;
    console.log(object);
    let response;
    if (productId) {
      response = await fetchWrapper.put(
        baseUrl + "/" + productId,
        object,
        "Product has been updated!"
      );
      console.log(response);
    } else {
      response = await fetchWrapper.post(
        baseUrl,
        object,
        "Product has been created!"
      );
      console.log(response);
    }
    if (response) {
      setModalShow(false);
      fetchProducts();
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    setProductId(id);
    const response = await fetchWrapper.get(`${baseUrl}/${id}`);
    if (response) {
      setValues(response);
      setSupplierCost(response.supplier_cost);
      setSellingCost(response.selling_price);
      setVat(response.vat_applicable);
      setModalShow(true);
    }
  };

  const handleDelClose = () => setDelShow(false);

  const handleDelete = async (id) => {
    const response = await fetchWrapper.delete(baseUrl + "/" + id);
    if (response) {
      fetchProducts();
      setDelShow(false);
    }
  };

  const cleanupFn = () => {
    setModalShow(false);
    setValues(null);
    setProductId("");
    setSellingCost(0);
    setSupplierCost(0);
    setVat(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <Form>
          <Row className="">
            <Col>
              <Form.Group>
                <Form.Control
                  name="productName"
                  size="sm"
                  type="search"
                  value={filter.productName}
                  onChange={filterProductName}
                  placeholder="search product name"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <div>
          <Button size="sm" onClick={() => setModalShow(true)}>
            Add Product
          </Button>
        </div>
      </div>

      <FormModal show={modalShow} onHide={cleanupFn} formTitle="Add Products">
        <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
          <Row>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Product Code</Form.Label>
                <Form.Control
                  size="sm"
                  name="product_code"
                  type="text"
                  defaultValue={values?.product_code}
                  placeholder="Enter product code"
                />
              </Form.Group>
            </Col>
            <Col sm="5">
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  required
                  size="sm"
                  name="product_name"
                  type="text"
                  defaultValue={values?.product_name}
                  placeholder="Enter product name"
                />
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  size="sm"
                  as="select"
                  name="product_category"
                  defaultValue={values?.product_category}
                  required
                >
                  <option selected disabled value="">
                    select category
                  </option>
                  <option value="lens">Lens</option>
                  <option value="frame">Frame</option>
                  <option value="contanct lens">Contanct lens</option>
                  <option value="cleaning solution">Cleaning solution</option>
                  <option value="accessories">Accessories</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  size="sm"
                  name="brand"
                  type="text"
                  defaultValue={values?.brand}
                  placeholder="Enter brand"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  size="sm"
                  name="description"
                  as="textarea"
                  defaultValue={values?.description}
                  placeholder="Describe product..."
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <Row>
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Product For</Form.Label>
                    <Form.Control
                      size="sm"
                      as="select"
                      name="product_for"
                      defaultValue={values?.product_for}
                      required
                    >
                      <option selected disabled value="">
                        select
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Kids">Kids</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Ordered Qty.</Form.Label>
                    <Form.Control
                      size="sm"
                      name="ordered_quantity"
                      type="number"
                      defaultValue={values?.ordered_quantity}
                      placeholder="Enter qunatity"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Current Qty.</Form.Label>
                    <Form.Control
                      size="sm"
                      name="current_quantity"
                      defaultValue={values?.current_quantity}
                      type="number"
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Reorder Level</Form.Label>
                    <Form.Control
                      size="sm"
                      name="reorder_level"
                      type="number"
                      defaultValue={values?.reorder_level}
                      placeholder="Set re-order"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col sm="6">
              <Row className="align-items-center">
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Purchase Cost</Form.Label>
                    <Form.Control
                      size="sm"
                      name="supplier_cost"
                      type="number"
                      step="0.001"
                      defaultValue={values?.supplier_cost}
                      placeholder="Enter purchase cost"
                      onChange={(e) => setSupplierCost(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col sm="6">
                  <Form.Group>
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control
                      size="sm"
                      name="selling_price"
                      type="number"
                      step="0.001"
                      placeholder="Enter selling price"
                      defaultValue={values?.selling_price}
                      required
                      onChange={(e) => setSellingCost(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                {/* <Col sm="6">
                  <Form.Group>
                    <Form.Label>Profit (RE)</Form.Label>
                    <Form.Control
                      size="sm"
                      name="profit"
                      type="number"
                      value={(sellingCost - supplierCost).toFixed(3)}
                      disabled
                    />
                  </Form.Group>
                </Col> */}
                <Col sm={{ offset: 6 }}>
                  <Form.Group>
                    <Form.Label>Stocked on</Form.Label>
                    <Form.Control
                      size="sm"
                      name="created_at"
                      type="date"
                      placeholder="dd-mm-yyyy"
                      min="1997-01-01"
                      max="2030-12-31"
                      defaultValue={moment(values?.created_at).format(
                        "yyyy-MM-DD"
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Button size="sm" className="btn btn-success" type="submit">
              Save & Close
            </Button>
          </div>
        </Form>
      </FormModal>
      <DataTable
        data={filter.list}
        columns={columns}
        customStyles={customStyles}
        defaultSortFieldId={1}
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
      <Modal show={delShow} onHide={handleDelClose} size="sm" centered>
        <Modal.Body>
          <Alert variant="danger">
            <div className="pr-2 fa fa-exclamation-triangle"></div>
            Do you want to delete this product?
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(productId)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleDelClose}>
            Go Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
