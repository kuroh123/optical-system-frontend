import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Card } from "react-bootstrap";
// import ModuleDatePicker from "_components/ModuleDatePicker";
import { fetchWrapper } from "_helpers";
import { useSelector } from "react-redux";

export { Dashboard };

function Dashboard() {
  const user = useSelector((x) => x.auth.user);
  const baseUrl = `${process.env.REACT_APP_API_URL}/dashboard/`;

  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  // Dashboard metrics configuration
  const dashboardMetrics = [
    {
      title: "Total Customers",
      value: dashboardData?.patients,
      icon: "👥",
      color: "#4F46E5",
      bgColor: "#EEF2FF",
    },
    {
      title: "Total Invoices",
      value: dashboardData?.bill,
      icon: "📄",
      color: "#059669",
      bgColor: "#ECFDF5",
    },
    {
      title: "Total Revenue",
      value: dashboardData?.total_revenue,
      icon: "💰",
      color: "#DC2626",
      bgColor: "#FEF2F2",
    },
    {
      title: "Total VAT",
      value: dashboardData?.total_vat?.toFixed(3),
      icon: "📊",
      color: "#7C2D12",
      bgColor: "#FEF7F2",
    },
    {
      title: "Total Balance",
      value: dashboardData?.total_balance,
      icon: "⚖️",
      color: "#7C3AED",
      bgColor: "#F3E8FF",
    },
  ];

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
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Container
          fluid
          className="my-4"
          style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}
        >
          {/* Header Section */}
          <Row className="mb-4">
            <Col md="12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold text-dark mb-1">Dashboard Overview</h2>
                  <p className="text-muted mb-0">
                    Welcome back! Here's what's happening at your optical store.
                  </p>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    Last updated: {moment().format("MMMM DD, YYYY")}
                  </small>
                </div>
              </div>
              <Alert
                variant="info"
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: "#EBF8FF",
                  borderLeft: "4px solid #3182CE",
                }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">📍</span>
                  <strong>Current Location: </strong>
                  <span className="ms-1">
                    {user.user.location
                      ? user.user.location.name
                      : "No location selected"}
                  </span>
                </div>
              </Alert>
            </Col>
          </Row>

          {/* Metrics Cards */}
          <Row className="g-4">
            {dashboardMetrics.map((metric, index) => (
              <Col key={index} lg="2" md="4" sm="6">
                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: metric.bgColor,
                          fontSize: "20px",
                        }}
                      >
                        {metric.icon}
                      </div>
                      <div className="text-end">
                        <div
                          className="small px-2 py-1 rounded-pill text-white"
                          style={{
                            backgroundColor: metric.color,
                            fontSize: "10px",
                          }}
                        >
                          ACTIVE
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3
                        className="fw-bold mb-1"
                        style={{ color: metric.color, fontSize: "1.75rem" }}
                      >
                        {metric.value || 0}
                      </h3>
                      <p className="text-muted mb-0 small fw-medium">
                        {metric.title}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Additional Stats Section */}
          <Row className="mt-5">
            <Col md="12">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold">Quick Stats</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md="3" className="text-center">
                      <div className="mb-2">
                        <span className="display-6">📈</span>
                      </div>
                      <h6 className="text-muted">Growth Rate</h6>
                      <p className="text-success fw-bold">+12.5%</p>
                    </Col>
                    <Col md="3" className="text-center">
                      <div className="mb-2">
                        <span className="display-6">🎯</span>
                      </div>
                      <h6 className="text-muted">Monthly Target</h6>
                      <p className="text-primary fw-bold">85%</p>
                    </Col>
                    <Col md="3" className="text-center">
                      <div className="mb-2">
                        <span className="display-6">⭐</span>
                      </div>
                      <h6 className="text-muted">Customer Satisfaction</h6>
                      <p className="text-warning fw-bold">4.8/5</p>
                    </Col>
                    <Col md="3" className="text-center">
                      <div className="mb-2">
                        <span className="display-6">🚀</span>
                      </div>
                      <h6 className="text-muted">Performance</h6>
                      <p className="text-info fw-bold">Excellent</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}
