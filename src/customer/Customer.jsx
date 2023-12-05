import moment from "moment";
import { ViewEyeDetails } from "customer/ViewEyeDetails";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { BiMoneyWithdraw, BiReceipt } from "react-icons/bi";
import { BsFillClipboard2PlusFill, BsFillEyeFill } from "react-icons/bs";
import { gender } from "_helpers/eye-details";

// import { parseISO, format } from "date-fns";

import { patientsActions } from "_store";
import FormModal from "_components/FormModal";
import { customStyles } from "_helpers/tableCustomStyle";

export { Customer };

function Customer() {
  const { customerId } = useParams();
  const form = useRef();
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const [fetchedPatients, setFetchedPatients] = useState([]);
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const [values, setValues] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [delShow, setDelShow] = useState(false);
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    first_name: "",
    mobile: "",
    list: [],
  });

  const fetchPatient = async () => {
    const response = await fetchWrapper.get(`${baseUrl}`);
    if (response) {
      setFetchedPatients(response);
      setFilter({ list: response });
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);
  console.log(fetchedPatients);

  const handleDelClose = () => setDelShow(false);

  const handleDelete = async (id) => {
    const response = await fetchWrapper.delete(baseUrl + "/" + id);
    if (response) {
      window.location.reload(false);
    }
  };

  const filterFirstName = (e) => {
    const results = fetchedPatients.filter((patient) => {
      if (e.target.value === "") return fetchedPatients;
      return patient.first_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilter({
      first_name: e.target.value,
      list: results,
    });
  };

  const filterMobile = (e) => {
    const results = fetchedPatients.filter((patient) => {
      if (e.target.value === "") return fetchedPatients;
      return patient.mobile?.toString().includes(e.target.value);
    });
    setFilter({
      mobile: e.target.value,
      list: results,
    });
  };

  const columns = [
    {
      name: "Customer Name",
      selector: (row) => `${row?.first_name} ${row?.last_name}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender ",
      selector: (row) => row?.gender,
      width: "60px",
    },
    {
      name: "Mobile",
      selector: (row) => row?.mobile,
    },
    {
      name: "Examined By",
      selector: (row) => row?.examined_by,
    },
    {
      name: "Registered On",
      selector: (row) => moment(row?.created_at).format("DD-MM-YYYY h:mm a"),
    },
    {
      name: "Eye Details",
      selector: null,
      width: "145px",
      cell: (row, index) => (
        <div className="d-flex">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">Add Eye Details</Tooltip>}
          >
            <div
              className="table-button ms-3"
              onClick={(e) => {
                navigate(`/customers/eyeDetails/${row._id}`);
              }}
            >
              <BsFillClipboard2PlusFill size={16}></BsFillClipboard2PlusFill>
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">View Eye Details</Tooltip>}
          >
            <div
              className="table-button ms-3"
              onClick={(e) => {
                setCurrentCustomerId(row._id);
                setShow(true);
              }}
            >
              <BsFillEyeFill size={16} />
            </div>
          </OverlayTrigger>
        </div>
      ),
    },
    // {
    //   name: "View",
    //   selector: null,
    //   width: "145px",
    //   cell: (row, index) => (
    //     <div className="d-flex">
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={<Tooltip id="tooltip">View Eye Details</Tooltip>}
    //       >
    //         <div
    //           className="table-button ms-3"
    //           onClick={(e) => {
    //             setCurrentCustomerId(row._id);
    //             setShow(true);
    //           }}
    //         >
    //           <BsFillEyeFill size={16} />
    //         </div>
    //       </OverlayTrigger>
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={<Tooltip id="tooltip">View Bill</Tooltip>}
    //       >
    //         <div
    //           className="table-button ms-3"
    //           onClick={(e) => {
    //             setCurrentCustomerId(row._id);
    //             setShow(true);
    //           }}
    //         >
    //           <BiReceipt size={16} />
    //         </div>
    //       </OverlayTrigger>
    //     </div>
    //   ),
    // },
    {
      name: "Actions",
      selector: null,
      cell: (row, index) => (
        <div className="d-flex">
          <Button
            className="btn-warning fa fa-edit"
            size="sm"
            onClick={(e) => handleEdit(e, row._id)}
            id={row._id}
          />
          <Button
            className="ms-3 btn-danger fa fa-trash"
            size="sm"
            onClick={() => {
              setCurrentCustomerId(row._id);
              setDelShow(true);
            }}
            id={row._id}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    console.log(object);
    const updatedObject = {
      ...object,
      first_name: object.first_name.toUpperCase(),
      last_name: object.last_name.toUpperCase(),
    };
    let response;
    if (currentCustomerId) {
      response = await fetchWrapper.put(
        baseUrl + "/" + currentCustomerId,
        updatedObject,
        "Patient has been updated!"
      );
      console.log(response);
    } else {
      response = await fetchWrapper.post(
        baseUrl,
        updatedObject,
        "Patient has been created!"
      );
    }
    if (response) {
      setModalShow(false);
      fetchPatient();
      cleanupFn();
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    setCurrentCustomerId(id);
    const response = await fetchWrapper.get(`${baseUrl}/${id}`);
    if (response) {
      setValues(response);
      setModalShow(true);
    }
  };

  const cleanupFn = () => {
    setModalShow(false);
    setValues(null);
    setCurrentCustomerId("");
  };

  if (customerId) {
    return <Outlet />;
  }

  return (
    <Container>
      <Form>
        <Row className="mb-3 mt-4">
          <Col sm="3">
            <Form.Group>
              <Form.Label>Search By Name</Form.Label>
              <Form.Control
                autoComplete="off"
                name="first_name"
                size="sm"
                type="search"
                value={filter.first_name}
                onChange={filterFirstName}
              />
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group>
              <Form.Label>Search By Mobile</Form.Label>
              <Form.Control
                autoComplete="off"
                name="mobile"
                size="sm"
                type="search"
                value={filter.mobile}
                onChange={filterMobile}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mb-3">
          <Button
            className="text-light"
            variant="primary"
            size="sm"
            onClick={() => setModalShow(true)}
          >
            Add Customer
          </Button>
        </div>
      </Form>
      <FormModal
        show={modalShow}
        onHide={cleanupFn}
        formTitle="Register Customer"
      >
        <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
          <Container fluid>
            <Row className="mb-3 mt-4">
              <Col md={{ span: 6, offset: 3 }} className="mb-2">
                <Form.Group>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    required
                    size="sm"
                    name="first_name"
                    type="text"
                    defaultValue={values?.first_name}
                    onChange={(e) => setFirstName(e.target.value.toUpperCase())}
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={{ span: 6, offset: 3 }} className="mb-2">
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="last_name"
                    type="text"
                    size="sm"
                    defaultValue={values?.last_name}
                    onChange={(e) => setLastName(e.target.value.toUpperCase())}
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
              <Col md={{ span: 6, offset: 3 }} className="mb-2">
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    required
                    size="sm"
                    name="mobile"
                    type="number"
                    defaultValue={values?.mobile}
                    placeholder="Enter Mobile no."
                  />
                </Form.Group>
              </Col>
              <Col md={{ span: 6, offset: 3 }} className="mb-2">
                <Form.Group>
                  <Form.Label>Examined By</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="examined_by"
                    size="sm"
                    type="text"
                    defaultValue={values?.examined_by}
                    placeholder="Examined By"
                  />
                </Form.Group>
              </Col>
              <Col md={{ span: 6, offset: 3 }} className="mb-2">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name="address"
                    size="sm"
                    type="textarea"
                    defaultValue={values?.address}
                    placeholder="Enter Address"
                  />
                </Form.Group>
              </Col>
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
                      <option
                        selected={elem.value === values?.gender}
                        value={elem.value}
                      >
                        {elem.label}
                      </option>
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
      <Modal show={delShow} onHide={handleDelClose} size="sm" centered>
        <Modal.Body>
          <Alert variant="danger">
            <div className="pr-2 fa fa-exclamation-triangle"></div>
            Do you want to delete this patient and all its history?
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDelete(currentCustomerId)}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleDelClose}>
            Go Back
          </Button>
        </Modal.Footer>
      </Modal>
      <ViewEyeDetails show={show} setShow={setShow} id={currentCustomerId} />
    </Container>
  );
}
