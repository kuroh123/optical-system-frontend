import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link, Outlet, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { payment_status, status } from "_helpers/eye-details";
import BillingForm from "./BillingForm";
import ReactToPrint from "react-to-print";
import PrintBill from "./PrintBill";

export { Billing };

const Billing = () => {
  const { billingId } = useParams();
  const baseUrl = `${process.env.REACT_APP_API_URL}/billing`;
  const [billing, setBilling] = useState([]);
  const [billId, setBillId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [startDateTime, setStartDateTime] = useState(
    moment().format("YYYY-MM-01T00:00:00Z")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")
  );

  const printBillRef = useRef();

  const [filter, setFilter] = useState({
    bill_no: "",
    first_name: "",
    mobile: "",
    payment_status: "",
    list: [],
  });

  const fetchBilling = async () => {
    const response = await fetchWrapper.get(
      `${baseUrl}?startDate=${startDateTime}&endDate=${endDateTime}`
    );
    if (response) {
      setBilling(response);
      setFilter({ list: response });
    }
  };

  useEffect(() => {
    fetchBilling();
  }, [startDateTime, endDateTime]);
  console.log(billing);

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

  const conditionalRowStyles = [
    {
      when: (row) => row.payment_status == "pending",
      style: {
        backgroundColor: "#ffbebc",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    {
      when: (row) => row.payment_status == "partially_paid",
      style: {
        backgroundColor: "#ffe1a6",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  // const handleShow = () => setShow(true);

  const handleDelete = async (id) => {
    const response = await fetchWrapper.delete(baseUrl + "/" + id);
    if (response) {
      window.location.reload(false);
    }
  };

  const filterFirstName = (e) => {
    const results = billing.filter((item) => {
      if (e.target.value === "") return billing;
      return item.patient.first_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilter({
      first_name: e.target.value,
      list: results,
    });
  };

  const filterBillNo = (e) => {
    const results = billing.filter((item) => {
      if (e.target.value === "") return billing;
      return item.bill_no.toString() === e.target.value;
    });
    setFilter({
      bill_no: e.target.value,
      list: results,
    });
  };

  const filterMobile = (e) => {
    const results = billing.filter((item) => {
      if (e.target.value === "") return billing;
      return item.patient.mobile.toString().includes(e.target.value);
    });
    setFilter({
      mobile: e.target.value,
      list: results,
    });
  };

  const filterPaymentStatus = (e) => {
    const results = billing.filter((item) => {
      if (e.value === "") return billing;
      return item.payment_status.toString() === e.value;
    });
    setFilter({
      payment_status: e.value,
      list: results,
    });
  };

  const columns = [
    {
      name: "Bill No.",
      selector: (row) => row.bill_no,
      sortable: true,
      width: "85px",
    },
    {
      name: "Payment Status",
      selector: (row) => row.payment_status,
      sortable: true,
      width: "120px",
    },
    {
      name: "Patient Name",
      selector: (row) => `${row.patient?.first_name} ${row.patient?.last_name}`,
      sortable: true,
      width: "160px",
    },
    {
      name: "Mobile",
      selector: (row) => row.patient?.mobile,
      width: "120px",
    },
    // {
    //   name: "Examined By",
    //   selector: (row) => row.patient?.examined_by,
    // },
    {
      name: "Billed on",
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
      name: "Balance",
      selector: (row) => row.balance_amount,
    },
    {
      name: "Actions",
      selector: null,
      width: "160px",
      cell: (row, index) => (
        <div className="d-flex align-items-center">
          <Button
            size="sm"
            className={`btn-warning fa fa-edit`}
            as={Link}
            to={`/billing/${row._id}`}
            id={row.id}
          ></Button>
          <div className="ml-3">
            <ReactToPrint
              trigger={() => (
                <Button className="btn-success fa fa-print" size="sm" />
              )}
              content={() => printBillRef.current}
            />
            <div style={{ display: "none" }}>
              <PrintBill ref={printBillRef} row={row.id} />
            </div>
          </div>
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
      selector: (row) => moment(row.patient?.created_at).format("DD-MM-YYYY"),
    },
  ];

  if (billingId) {
    return <Outlet />;
  }
  return (
    <>
      <div className="">
        <ModuleDatePicker
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          setStartDateTime={setStartDateTime}
          setEndDateTime={setEndDateTime}
          fetchData={fetchBilling}
        />
        <Form>
          <Row className="mb-3 mt-4">
            <Col sm="2">
              <Form.Group>
                <Form.Label>Search By Bill No</Form.Label>
                <Form.Control
                  name="bill_no"
                  size="sm"
                  type="search"
                  value={filter.visit_id}
                  onChange={filterBillNo}
                />
              </Form.Group>
            </Col>
            <Col sm="2">
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
            <Col sm="2">
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
            <Col sm="2" className="ml-auto mb-1">
              <div className="form-group">
                <label>Payment Status</label>
                <ReactSelect
                  name="payment_status"
                  options={status}
                  setValue={filter.payment_status}
                  onChange={filterPaymentStatus}
                />
              </div>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-end align-items-center mb-3 mt-4">
          <div>
            <Button size="sm" onClick={() => setModalShow(true)}>
              Add New Bill
            </Button>
          </div>
        </div>
        <DataTable
          data={filter.list}
          conditionalRowStyles={conditionalRowStyles}
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
      <BillingForm
        modalShow={modalShow}
        setModalShow={setModalShow}
        fetchBilling={fetchBilling}
      />
    </>
  );
};
