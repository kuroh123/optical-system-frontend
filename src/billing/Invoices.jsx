import moment from "moment";
import { useEffect, useState, useRef } from "react";
import {
  Accordion,
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
import DataTable from "react-data-table-component";
import { Link, Outlet, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { payment_status, status } from "_helpers/eye-details";
import ReactToPrint from "react-to-print";
import PrintInvoice from "./PrintInvoice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BillingFormv2 from "./BillingFormv2";
import { customStyles } from "_helpers/tableCustomStyle";
import TransactionModal from "./TransactionModal";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import PrintInvoiceA5 from "./PrintInovoiceA5";

export { Invoices };

const Invoices = () => {
  const { billingId } = useParams();
  const baseUrl = `${process.env.REACT_APP_API_URL}/billing`;
  const [billing, setBilling] = useState([]);
  const [printData, setPrintData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState("");
  const [pending, setPending] = useState(false)
  const user = useSelector((x) => x.auth.user.user);

  const printBillRef = useRef(null);
  const test = useRef(null);

  const [filter, setFilter] = useState({
    bill_no: "",
    first_name: "",
    mobile: "",
    payment_status: "",
    list: [],
  });

  const fetchBilling = async () => {
    setPending(true)
    const response = await fetchWrapper.get(
      `${baseUrl}/${user.location ? `?location=${user.location?._id}` : ""}`
    );
    if (response) {
      setPending(false)
      setBilling(response);
      setFilter({ list: response });
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);
  console.log(billing);

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
  const handlePrintData = (id) => {
    const data = billing?.find((elem) => elem._id === id);
    if (data) {
      setPrintModal(true);
      setPrintData(data);
    } else {
      toast.error("Could not print invoice!");
    }
  };

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
      ...filter,
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
      return item.patient.mobile?.toString().includes(e.target.value);
    });
    setFilter({
      mobile: e.target.value,
      list: results,
    });
  };

  const filterPaymentStatus = (e) => {
    console.log(e);
    const results = billing.filter((item) => {
      if (!e || e.value === "") return billing;
      return item.payment_status.toString() === e?.value;
    });
    setFilter({
      payment_status: e?.value,
      list: results,
    });
  };

  // TO BE FIXED

  // const filterBilling = (e) => {
  //   const { name } = e.target;
  //   let results;
  //   if (!e || e.target.value === "" || e.value === "") {
  //     results = billing;
  //   } else {
  //     results = billing
  //       .filter((item) =>
  //         item.patient.first_name
  //           .toLowerCase()
  //           .includes(e.target.value.toLowerCase())
  //       )
  //       .filter((item) => item.bill_no.toString() === e.target.value);
  //   }
  //   setFilter({
  //     ...filter,
  //     [name]: e.target.value || e?.value,
  //     list: results,
  //   });
  // };

  const columns = [
    {
      name: "Invoice No.",
      selector: (row) => row.bill_no,
      sortable: true,
      width: "100px",
    },
    // {
    //   name: "File No. (old)",
    //   selector: (row) => row.file_no,
    //   sortable: true,
    //   width: "100px",
    // },
    {
      name: "Payment Status",
      selector: (row) => row.payment_status,
      sortable: true,
      width: "120px",
    },
    {
      name: "Patient Name",
      selector: (row) => `${row.patient?.first_name} ${row.patient?.last_name ? row.patient?.last_name : ""}`,
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
      selector: (row) => moment(row.created_at).format("DD-MM-YYYY hh:mm a"),
      width: "170px",
    },
    {
      name: "Grand Total",
      selector: (row) => row.grand_total,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.paidAmount,
    },
    {
      name: "Balance",
      selector: (row) => row.balanceAmount,
    },
    {
      name: "Actions",
      selector: null,
      width: "150px",
      cell: (row, index) => (
        <div className="d-flex align-items-center">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">Transactions</Tooltip>}
          >
            <Button
              className="btn-primary fa fa-exchange"
              size="sm"
              onClick={() => {
                setCurrentInvoiceId(row._id);
                setTransactionModal(true);
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">Print</Tooltip>}
          >
            <Button
              className="mx-3 btn-primary fa fa-print"
              size="sm"
              onClick={() => handlePrintData(row._id)}
            />
          </OverlayTrigger>
          <Button
            className="btn-danger fa fa-trash"
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

  console.log("[print]", printData);

  if (billingId) {
    return <Outlet />;
  }
  return (
    <Container>
      <Accordion className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Filters</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col sm="2">
                <Form.Group>
                  <Form.Control
                    autoComplete="off"
                    name="bill_no"
                    size="sm"
                    type="search"
                    value={filter.visit_id}
                    onChange={filterBillNo}
                    placeholder="Search by inovice no."
                  />
                </Form.Group>
              </Col>
              <Col sm="2">
                <Form.Group>
                  <Form.Control
                    autoComplete="off"
                    name="first_name"
                    size="sm"
                    type="search"
                    value={filter.first_name}
                    onChange={filterFirstName}
                    placeholder="Search by name"
                  />
                </Form.Group>
              </Col>
              <Col sm="2">
                <Form.Group>
                  <Form.Control
                    autoComplete="off"
                    name="mobile"
                    size="sm"
                    type="search"
                    value={filter.mobile}
                    onChange={filterMobile}
                    placeholder="Search by mobile"
                  />
                </Form.Group>
              </Col>
              <Col sm="2" className="ms-auto mb-1">
                <div className="form-group">
                  <div className="form-control-sm">
                    <ReactSelect
                      name="payment_status"
                      options={status}
                      setValue={filter.payment_status}
                      onChange={filterPaymentStatus}
                      placeholder="Search status"
                      isClearable
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="d-flex justify-content-end align-items-center mb-3 mt-4">
        <div>
          <Button
            className="text-light"
            size="sm"
            onClick={() => setModalShow(true)}
          >
            Add New Bill
          </Button>
        </div>
      </div>
      <DataTable
        data={filter.list}
        conditionalRowStyles={conditionalRowStyles}
        columns={columns}
        customStyles={customStyles}
        dense
        persistTableHead
        responsive
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        progressPending={pending}
        progressComponent={
          <div className="py-5">
            <Spinner className="my-5" animation="border" variant="primary" />
          </div>
        }
      />

      <BillingFormv2
        modalShow={modalShow}
        setModalShow={setModalShow}
        fetchBilling={fetchBilling}
      />
      <TransactionModal
        show={transactionModal}
        setShow={setTransactionModal}
        id={currentInvoiceId}
        fetchBilling={fetchBilling}
      />
      <Modal
        show={printModal}
        size="md"
        onHide={() => setPrintModal(false)}
        centered
      >
        <Modal.Header>
          <div className="modalCrossBtn position-absolute cursor-pointer">
            <AiOutlineClose size={20} onClick={() => setPrintModal(false)} />
          </div>
          <div style={{ fontWeight: 500 }}>
            Print inovice for {printData?.patient.first_name}{" "}
            {printData?.patient.last_name}
          </div>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column justify-content-center">
          <ReactToPrint
            trigger={() => {
              return (
                <div className="d-flex justify-content-center mt-3">
                  <Button className="btn-success fa fa-print" size="sm">
                    Print Invoice
                  </Button>
                </div>
              );
            }}
            content={() => printBillRef.current}
          />
          <div style={{ display: "none" }}>
            <PrintInvoiceA5 ref={printBillRef} printData={printData} />
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
