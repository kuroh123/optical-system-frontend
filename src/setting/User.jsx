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
import { useSelector } from "react-redux";
import { customStyles } from "_helpers/tableCustomStyle";

export { User };

function User() {
  const user = useSelector((x) => x.auth.user.user);
  const form = useRef();
  const navigate = useNavigate();
  const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
  const [modalShow, setModalShow] = useState(false);
  const [delShow, setDelShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState(null);
  const [userId, setUserId] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();

  // const [startDateTime, setStartDateTime] = useState(
  //   moment(today).format("YYYY-MM-DDT00:00:00Z")
  // );
  // const [endDateTime, setEndDateTime] = useState(
  //   moment(today).format("YYYY-MM-DDTHH:mm:ssZ")
  // );

  const columns = [
    {
      name: "S. no.",
      selector: (row) => row?.user_code,
      sortable: true,
      width: "65px",
    },
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      wrap: true,
    },
    {
      name: "is Admin",
      selector: (row) => (row.isAdmin ? "Yes" : "No"),
      wrap: true,
    },
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
              setUserId(row._id);
              setDelShow(true);
            }}
            id={row._id}
          />
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setUsers(response);
    }
  };
  const fetchLocations = async () => {
    const response = await fetchWrapper.get(
      `${process.env.REACT_APP_API_URL}/locations`
    );
    if (response) {
      setLocations(response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    object.location = selectedLocation;
    console.log("Submission Obj", object);
    let response;
    if (userId) {
      response = await fetchWrapper.put(
        baseUrl + "/" + userId,
        object,
        "User has been updated!"
      );
      console.log(response);
    } else {
      response = await fetchWrapper.post(
        baseUrl,
        object,
        "User has been created!"
      );
      console.log(response);
    }
    if (response) {
      setModalShow(false);
      fetchUsers();
      cleanupFn();
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    setUserId(id);
    const response = await fetchWrapper.get(`${baseUrl}/${id}`);
    if (response) {
      setValues(response);
      setModalShow(true);
    }
  };

  const handleDelClose = () => setDelShow(false);

  const handleDelete = async (id) => {
    const response = await fetchWrapper.delete(baseUrl + "/" + id);
    if (response) {
      fetchUsers();
      setDelShow(false);
    }
  };

  const cleanupFn = () => {
    setModalShow(false);
    setValues(null);
    setUserId("");
  };

  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-end mb-3 mt-4">
        <Button
          className="text-light"
          size="sm"
          onClick={() => setModalShow(true)}
        >
          Add User
        </Button>
      </div>

      <FormModal show={modalShow} onHide={cleanupFn} formTitle="User">
        <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
          <Row>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  autoComplete="off"
                  size="sm"
                  name="name"
                  type="text"
                  defaultValue={values?.name}
                  placeholder="Enter user name"
                />
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  autoComplete="off"
                  required
                  size="sm"
                  name="email"
                  type="text"
                  defaultValue={values?.email}
                  placeholder="example@gmail.com"
                />
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  autoComplete="off"
                  required
                  size="sm"
                  name="password"
                  type="password"
                  disabled={userId}
                  defaultValue={values?.password}
                  placeholder="Enter strong password"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <Form.Group>
                <Form.Label>Set Location</Form.Label>
                <Form.Control
                  autoComplete="off"
                  size="sm"
                  as="select"
                  //   name="location"
                  defaultValue={values?.location?._id}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option selected disabled value="">
                    select location
                  </option>
                  {locations?.map((location) => (
                    <option
                      selected={location._id === values?.location}
                      key={location._id}
                      value={location._id}
                    >
                      {location.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <div className="d-flex justify-content-center align-items-center mt-5">
              <Button size="sm" className="btn btn-success" type="submit">
                Save & Close
              </Button>
            </div>
          </Row>
        </Form>
      </FormModal>
      <DataTable
        data={users}
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
            Do you want to delete this user?
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(userId)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleDelClose}>
            Go Back
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
