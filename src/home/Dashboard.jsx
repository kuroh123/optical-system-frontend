import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { useSelector } from "react-redux";

export { Dashboard };

function Dashboard() {
  const user = useSelector((x) => x.auth.user);
  const baseUrl = `${process.env.REACT_APP_API_URL}/dashboard`;

  const [dashboardData, setDashboardData] = useState({});

  const fetchDashboard = async () => {
    const response = await fetchWrapper.get(`${baseUrl}`);
    setDashboardData(response);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  console.log(dashboardData);

  return (
    <Container className="my-3">
      <Row>
        <Col sm="6">
          <Alert>
            <strong>Location: </strong>
            {user.user.location ? user.user.location.name : "None"}
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col sm="3" className="card bg-info text-white">
          <div className="card-body">
            <h5>Total Patients</h5>
            <h2 className="">{dashboardData?.patients}</h2>
          </div>
        </Col>
        {/* <Col sm="3" className="card bg-info text-white mx-3">
          <div className="card-body">
            <h5>Total Eye Details</h5>
            <h2 className="">{dashboardData?.patientRequests}</h2>
          </div>
        </Col> */}
        <Col sm="3" className="card bg-info text-white mx-3">
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
    </Container>
  );
}
