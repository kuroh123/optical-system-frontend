import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
// import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { useSelector } from "react-redux";

export { Dashboard };

function Dashboard() {
  const user = useSelector((x) => x.auth.user);
  const baseUrl = `${process.env.REACT_APP_API_URL}/dashboard/`;

  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    const response = await fetchWrapper.get(
      `${baseUrl}?location=${user.user.location?._id}`
    );
    setDashboardData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{ minHeight: "100vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner />
        </div>
      ) : (
        <Container fluid className="my-3">
          <Row>
            <Col md="12">
              <Alert>
                <strong>Location: </strong>
                {user.user.location ? user.user.location.name : "None"}
              </Alert>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md="4">
              <div className="card card-body">
                <h5 className="mb-5">Total Customers</h5>
                <h2 className="">{dashboardData?.patients}</h2>
              </div>
            </Col>
            <Col md="4">
              <div className="card card-body">
                <h5 className="mb-5">Total Invoices</h5>
                <h2 className="">{dashboardData?.bill}</h2>
              </div>
            </Col>
            <Col md="4">
              <div className="card card-body">
                <h5 className="mb-5">Total Revenue</h5>
                <h2 className="">{dashboardData?.total_revenue}</h2>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <div className="card card-body">
                <h5 className="mb-5">Total VAT</h5>
                <h2 className="">{dashboardData?.total_vat?.toFixed(3)}</h2>
              </div>
            </Col>
            <Col md="4">
              <div className="card card-body">
                <h5 className="mb-5">Total Balance</h5>
                <h2 className="">{dashboardData?.total_balance}</h2>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
