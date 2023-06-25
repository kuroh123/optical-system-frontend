import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { sultan_logo } from "assets";

const PrintBill = React.forwardRef((props, ref) => {
  const printData = props.printData;
  return (
    <>
      <style type="text/css" media="print">
        {" @page { size: landscape; } "}
      </style>
      <div>
        <Container className="" ref={ref}>
          <header className="d-flex justify-content-center align-items-center mt-3">
            <div>
              <img src={sultan_logo} width={130} height={120} alt="" />
            </div>
            <div className="d-flex flex-column align-items-center mx-5">
              <h1 style={{ color: "darkgreen", fontWeight: 900 }}>
                SULTAN OPTICALS
              </h1>
              <span className="d-block">
                C.R.No: 160857, P.O Box: 1063, P.C: 133
              </span>
              <span className="d-block">Al Khuwair, Sultanate of Oman</span>
            </div>
          </header>
          <hr />

          <Row>
            <Col>
              <table className="font-weight-bold">
                <tr>
                  <td>Bill No</td>
                  <td style={{ width: "20px" }}>:</td>
                  <td>{printData?.bill_no}</td>
                </tr>
                <tr>
                  <td>Customer Name</td>
                  <td style={{ width: "20px" }}>:</td>
                  <td>
                    {printData?.patient.first_name}{" "}
                    {printData?.patient.last_name}
                  </td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td style={{ width: "20px" }}>:</td>
                  <td>{printData?.patient.mobile}</td>
                </tr>
              </table>
            </Col>
          </Row>
          <hr />
          <Row className="mt-5">
            <Col>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <td style={{ width: "10%" }}>Sr. No</td>
                    <td>Item Code</td>
                    <td>Item</td>
                    <td>Brand</td>
                    <td>Category</td>
                    <td>Qty.</td>
                    <td>Unit Price</td>
                  </tr>
                </thead>
                <tbody>
                  {printData?.product_details.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.product.product_code}</td>
                      <td>{item.product.product_name}</td>
                      <td>{item.product.brand}</td>
                      <td>{item.product.product_category}</td>
                      <td>{item.sold_quantity}</td>
                      <td>{item.product.selling_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
});

export default PrintBill;
