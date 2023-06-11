import { fetchWrapper } from "_helpers";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { authActions } from "_store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Setting = () => {
  const user = useSelector((x) => x.auth.user);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const dispatch = useDispatch();

  const fetchLocations = async () => {
    const response = await fetchWrapper.get(
      `${process.env.REACT_APP_API_URL}/locations`
    );
    if (response) {
      setLocations(response);
    }
  };

  const handleLocationSwitch = async () => {
    const response = await fetchWrapper.post(
      `${process.env.REACT_APP_API_URL}/locations/mapUser/?location=${selectedLocation}`
    );
    if (response) {
      toast.success("Switched Location");
      dispatch(authActions.logout());
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  console.log(user.user.location.name);
  return (
    <Container>
      <Row>
        <Col sm="4">
          <Form.Group>
            <Form.Label>Set Location</Form.Label>
            <div className="d-flex">
              <Form.Control
                size="sm"
                as="select"
                name="product_category"
                defaultValue={user.user.location?._id}
                required
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option selected disabled value="">
                  select location
                </option>
                {locations?.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </Form.Control>
              <Button
                className="mx-2"
                size="sm"
                variant="success"
                onClick={handleLocationSwitch}
              >
                Change
              </Button>
            </div>
          </Form.Group>
        </Col>
        <Col sm="2"></Col>
      </Row>
    </Container>
  );
};

export default Setting;
