import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { useSelector } from "react-redux";

export { Dashboard };

function Dashboard() {
  const user = useSelector((x) => x.auth.user);
  const baseUrl = `${process.env.REACT_APP_API_URL}/dashboard`;
  const [startDateTime, setStartDateTime] = useState(
    moment().format("YYYY-MM-01T00:00:00Z")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")
  );

  const [dashboardData, setDashboardData] = useState({});

  const fetchDashboard = async () => {
    const response = await fetchWrapper.get(
      `${baseUrl}?startDate=${startDateTime}&endDate=${endDateTime}`
    );
    setDashboardData(response);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  console.log(dashboardData);

  return (
    <div className="mr-5">
      <div className="d-flex">
        <ModuleDatePicker
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          setStartDateTime={setStartDateTime}
          setEndDateTime={setEndDateTime}
          fetchData={fetchDashboard}
        />
        <div className="ml-auto">
          Location: {user.user.location ? user.user.location.name : "None"}
        </div>
      </div>
      <div fluid>
        <Row className="">
          <Col sm="3" className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Patients</h5>
              <h2 className="">{dashboardData?.patients}</h2>
            </div>
          </Col>
          <Col sm="3" className="card bg-info text-white mx-3">
            <div className="card-body">
              <h5>Total Prescriptions</h5>
              <h2 className="">{dashboardData?.patientRequests}</h2>
            </div>
          </Col>
          <Col sm="3" className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Bills</h5>
              <h2 className="">{dashboardData?.bill}</h2>
            </div>
          </Col>
        </Row>
        <Row className="my-3">
          <Col sm="3" className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h2 className="">{dashboardData?.total_revenue}</h2>
            </div>
          </Col>
          <Col sm="3" className="card bg-info text-white mx-3">
            <div className="card-body">
              <h5>Total VAT</h5>
              <h2 className="">{dashboardData?.total_vat}</h2>
            </div>
          </Col>
          <Col sm="3" className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Balance</h5>
              <h2 className="">{dashboardData?.total_balance}</h2>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
