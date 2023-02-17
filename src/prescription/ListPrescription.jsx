import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWrapper } from "_helpers";
import { ViewPrescription } from "./ViewPrescription";

export { ListPrescription };

function ListPrescription() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/patientrequest`;
  const [prescription, setPrescription] = useState([]);
  const [prescrbId, setPrescrbId] = useState("");
  const [show, setShow] = useState(false);

  const [filter, setFilter] = useState({
    visit_id: "",
    first_name: "",
    mobile: "",
    list: [],
  });

  const fetchPrescription = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setPrescription(response);
      setFilter({ list: response });
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, []);
  console.log(prescription);

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

  // const handleShow = () => setShow(true);

  const handleDelete = async (id) => {
    const response = await fetchWrapper.delete(baseUrl + "/" + id);
    if (response) {
      window.location.reload(false);
    }
  };

  const filterFirstName = (e) => {
    const results = prescription.filter((item) => {
      if (e.target.value === "") return prescription;
      return item.patient.first_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilter({
      first_name: e.target.value,
      list: results,
    });
  };

  const filterVisitId = (e) => {
    const results = prescription.filter((item) => {
      if (e.target.value === "") return prescription;
      return item.visit_id.toString() === e.target.value;
    });
    setFilter({
      visit_id: e.target.value,
      list: results,
    });
  };

  const filterMobile = (e) => {
    const results = prescription.filter((item) => {
      if (e.target.value === "") return prescription;
      return item.patient.mobile.toString().includes(e.target.value);
    });
    setFilter({
      mobile: e.target.value,
      list: results,
    });
  };

  const columns = [
    {
      name: "Visit ID",
      selector: (row) => row.visit_id,
      sortable: true,
      width: "85px",
    },
    {
      name: "Patient Name",
      selector: (row) => `${row.patient.first_name} ${row.patient.last_name}`,
      sortable: true,
      width: "160px",
    },
    {
      name: "Mobile",
      selector: (row) => row.patient.mobile,
    },
    {
      name: "Examined By",
      selector: (row) => row.patient.examined_by,
    },
    {
      name: "Prescribed on",
      selector: (row) => moment(row.created_at).format("DD-MM-YYYY hh:m a"),
      width: "170px",
    },
    {
      name: "Total Bill",
      selector: (row) => row.total_amount,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.paid_amount,
    },
    {
      name: "Actions",
      selector: null,
      cell: (row, index) => (
        <div className="d-flex">
          <Button
            className="btn-success fa fa-file-text-o"
            size="sm"
            onClick={(e) => {
              setPrescrbId(row._id);
              setShow(true);
            }}
          />
          <Button
            className="ml-3 btn-danger fa fa-trash"
            size="sm"
            onClick={() => handleDelete(row._id)}
            id={row._id}
          />
        </div>
      ),
    },
    {
      name: "First Visit At",
      selector: (row) => moment(row.patient.created_at).format("DD-MM-YYYY"),
    },
  ];

  return (
    <>
      <div className="">
        <Form>
          <Row className="mb-3 mt-4">
            <Col sm="3">
              <Form.Group>
                <Form.Label>Search By Visit ID</Form.Label>
                <Form.Control
                  name="visit_id"
                  size="sm"
                  type="search"
                  value={filter.visit_id}
                  onChange={filterVisitId}
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Search By Name</Form.Label>
                <Form.Control
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
                  name="mobile"
                  size="sm"
                  type="search"
                  value={filter.mobile}
                  onChange={filterMobile}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
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
      </div>
      <ViewPrescription show={show} setShow={setShow} id={prescrbId} />
    </>
  );
}
