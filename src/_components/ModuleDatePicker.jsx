import { useState } from "react";
import { Accordion, Col, Row, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const ModuleDatePicker = ({
  startDateTime,
  endDateTime,
  setStartDateTime,
  setEndDateTime,
  fetchData,
}) => {
  const today = new Date();
  // const [startDate, setStartDate] = useState(today.setHours(0, 0, 0, 0));
  // const [endDate, setEndDate] = useState(new Date());
  return (
    <div className="mb-3">
      <div className="d-flex align-items-end mb-3">
        <div className="d-flex flex-column mx-2">
          <Form.Label>Start Date:</Form.Label>
          <DatePicker
            readOnly
            dateFormat="yyyy-MM-dd HH:mm"
            selected={moment(startDateTime).toDate()}
            onChange={(date) => {
              setStartDateTime(moment(date).format("YYYY-MM-DDTHH:mm:ssZ"));
            }}
            selectsStart
            startDate={startDateTime}
            endDate={endDateTime}
            showTimeSelect
            style={{ width: 100 }}
          />
        </div>
        <div className="d-flex flex-column me-2">
          <Form.Label>End Date:</Form.Label>
          <DatePicker
            readOnly
            dateFormat="yyyy-MM-dd HH:mm"
            selected={moment(endDateTime).toDate()}
            onChange={(date) => {
              setEndDateTime(moment(date).format("YYYY-MM-DDTHH:mm:ssZ"));
            }}
            selectsEnd
            startDate={startDateTime}
            endDate={endDateTime}
            showTimeSelect
            style={{ width: 100 }}
          />
        </div>
        {/* <div sm={3} md={5} lg={3} className="d-flex align-items-end">
          <Button
            className="d-flex mx-2 align-items-center bg-info"
            type="button"
            onClick={() => {
              fetchData();
            }}
          >
            <span className="fa fa-search" size={20} />
          </Button>
        </div> */}
      </div>
      <div className="d-flex">
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="me-1"
          onClick={() => {
            setStartDateTime(
              moment(today.setHours(0, 0, 0, 0)).format("YYYY-MM-DDTHH:mm:ssZ")
            );
            setEndDateTime(moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ"));
          }}
        >
          Today
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(
              moment().subtract(1, "days").format("YYYY-MM-DDT00:00:00Z")
            );
            setEndDateTime(
              moment(today.setHours(0, 0, 0, 0)).format("YYYY-MM-DDTHH:mm:ssZ")
            );
          }}
        >
          Yesterday
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(moment().format("YYYY-MM-01T00:00:00Z"));
            setEndDateTime(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
          }}
        >
          This Month
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(
              moment().subtract(30, "days").format("YYYY-MM-DDT00:00:00Z")
            );
            setEndDateTime(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
          }}
        >
          Last 30 days
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(
              moment().subtract(1, "months").format("YYYY-MM-DDT00:00:00Z")
            );
            setEndDateTime(moment().format("YYYY-MM-01T00:00:00Z"));
          }}
        >
          Last Month
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(moment().format("YYYY-01-01T00:00:00Z"));
            setEndDateTime(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
          }}
        >
          This Year
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(
              moment().subtract(365, "days").format("YYYY-MM-DDT00:00:00Z")
            );
            setEndDateTime(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
          }}
        >
          Last 365 days
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline-secondary"
          className="mx-1"
          onClick={() => {
            setStartDateTime(
              moment().subtract(1, "years").format("YYYY-01-01T00:00:00Z")
            );
            setEndDateTime(moment().format("YYYY-01-01T00:00:00Z"));
          }}
        >
          Last Year
        </Button>
      </div>
    </div>
  );
};

export default ModuleDatePicker;
