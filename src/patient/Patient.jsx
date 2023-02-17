import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWrapper } from "_helpers";

import { patientsActions } from "_store";

export { Patient };

function Patient() {
  // const dispatch = useDispatch();
  // const { patients } = useSelector((state) => state.patients);
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;
  const [fetchedPatients, setFetchedPatients] = useState([]);
  const [filter, setFilter] = useState({
    first_name: "",
    mobile: "",
    list: [],
  });

  const fetchPatient = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setFetchedPatients(response);
      setFilter({ list: response });
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);
  console.log(fetchedPatients);

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
      return patient.mobile.toString().includes(e.target.value);
    });
    setFilter({
      mobile: e.target.value,
      list: results,
    });
  };

  const columns = [
    {
      name: "Patient Name",
      selector: (row) => `${row?.first_name} ${row?.last_name}`,
      sortable: true,
    },
    {
      name: "Age/Gender ",
      selector: (row) => `${row?.age}/${row?.gender}`,
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
      name: "Actions",
      selector: null,
      cell: (row, index) => (
        <div className="d-flex">
          <Button
            className="btn-success fa fa-eye"
            size="sm"
            as={Link}
            to={`/patient/${row._id}`}
            id={row._id}
          />
          <Button
            className="ml-3 btn-warning fa fa-edit"
            size="sm"
            as={Link}
            to={`/patient/${row._id}/edit`}
            id={row._id}
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
  ];

  return (
    <div className="">
      <Form>
        <Row className="mb-3 mt-4">
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
  );
}
