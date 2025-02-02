import { fetchWrapper } from "_helpers";
import { customStyles } from "_helpers/tableCustomStyle";
import { useEffect, useRef, useState } from "react";
import {
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
import { AiOutlineClose } from "react-icons/ai";

const TransactionModal = ({
  show,
  setShow,
  id,
  fetchBilling,
  page,
  perPage,
}) => {
  const baseUrl = `${process.env.REACT_APP_API_URL}/billing/transactions`;
  const [transactions, setTransactions] = useState([]);
  const form = useRef();

  const fetchTransactions = async () => {
    const response = await fetchWrapper.get(`${baseUrl}?billing=${id}`);
    if (response) {
      setTransactions(response);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransactions();
    }
  }, [id]);

  const columns = [
    {
      name: "Transaction Id",
      selector: (row) => row.transaction_id,
    },
    {
      name: "Bill No.",
      selector: (row) => row.billing?.bill_no,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Payment Type",
      selector: (row) => row.payment_type,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          className="ms-3 btn-danger fa fa-trash"
          size="sm"
          onClick={() => {
            handleDelete(row._id);
          }}
          id={row._id}
        />
      ),
    },
  ];

  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async (id) => {
    const response = fetchWrapper.delete(
      baseUrl + "/" + id,
      null,
      "Transaction Deleted!"
    );
    if (response) {
      setShow(false);
      fetchTransactions();
      fetchBilling(page, perPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    let object = {};
    formData.forEach((value, key) => (object[key] = value));
    object.billing = id;
    console.log(object);
    const response = await fetchWrapper.post(
      baseUrl,
      object,
      "Transaction Created!"
    );
    if (response) {
      setShow(false);
      fetchTransactions();
      fetchBilling();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header>
        <div className="modalCrossBtn position-absolute cursor-pointer">
          <AiOutlineClose size={20} onClick={handleClose} />
        </div>
        <Modal.Title id="contained-modal-title-vcenter">
          Transactions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={form} onSubmit={(e) => handleSubmit(e)}>
          <Row className="mb-3">
            <Col sm="3">
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  autoComplete="off"
                  size="sm"
                  name="amount"
                  type="number"
                  step={0.001}
                  placeholder="Enter paid amount"
                />
              </Form.Group>
            </Col>
            <Col sm="3">
              <Form.Group>
                <Form.Label>Payment Type</Form.Label>
                <select
                  className="form-control form-control-sm"
                  name="payment_type"
                  type="select"
                >
                  <option selected disabled>
                    Select Payment Type
                  </option>
                  <option value="cash">Cash</option>
                  <option value="visa">Visa</option>
                </select>
              </Form.Group>
            </Col>
            <Col sm={3} className="d-flex align-items-end">
              <Button type="submit" className="fa fa-plus" variant="success">
                Add Transaction
              </Button>
            </Col>
          </Row>
        </Form>
        <DataTable
          data={transactions}
          columns={columns}
          persistTableHead
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
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
