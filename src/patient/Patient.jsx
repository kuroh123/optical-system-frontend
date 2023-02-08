import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

  const fetchPatient = async () => {
    const response = await fetchWrapper.get(baseUrl);
    if (response) {
      setFetchedPatients(response);
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
        backgroundColor: "#474747",
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

  const columns = [
    {
      name: "Patient Name",
      selector: (row) => `${row?.first_name} ${row?.last_name}`,
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
      name: "Patient Request",
      selector: null,
      cell: (row, index) => (
        <Button size="sm" as={Link} to={`/patient/${row._id}`} id={row._id} />
      ),
    },
  ];

  return (
    <div className="">
      <DataTable
        data={fetchedPatients}
        columns={columns}
        customStyles={customStyles}
        responsive
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}
