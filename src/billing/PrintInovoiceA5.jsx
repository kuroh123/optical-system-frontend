import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { sultan_logo } from "assets";
import moment from "moment";

const PrintInvoiceA5 = React.forwardRef((props, ref) => {
  const printData = props.printData;
  const calculateVat = (amount, qty) => {
    return (parseFloat(amount) * parseInt(qty) * 0.05).toFixed(3);
  };
  return (
    <>
      <style type="text/css" media="print">
        {`
          @page {
            size: 21cm 14cm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
      <div>
        <div
          className="px-2"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
          }}
          ref={ref}
        >
          <header>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <div>
                <img src={sultan_logo} width={70} height={60} alt="" />
              </div>
              <div
                className="d-flex flex-column align-items-center mx-3"
                style={{ fontWeight: 500 }}
              >
                <h5 style={{ color: "darkgreen", fontWeight: 900 }}>
                  SULTAN OPTICALS
                </h5>
                <span className="d-block">
                  C.R.No: 1608576, P.O Box: 186, P.C: 133
                </span>
                <span className="d-block">Al Khuwair, Sultanate of Oman</span>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-end mt-2">
              <div style={{ fontSize: "16px", fontWeight: 600 }}>INVOICE</div>
            </div>
            {/* <div className="d-flex justify-content-end">
              <span style={{ fontWeight: 500 }}>VATIN: </span>
              OM1100179734
            </div> */}
          </header>
          <main className="border-top border-secondary">
            <Row>
              <Col className="d-flex justify-content-start">
                <table className="font-weight-bold">
                  <tr>
                    <td>Invoice for</td>
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
              <Col className="d-flex justify-content-end">
                <table className="font-weight-bold">
                  <tr>
                    <td>Bill No</td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{printData?.bill_no}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>
                      {moment(printData?.created_at).format(
                        "DD-MM-YYYY h:mm a"
                      )}
                    </td>
                  </tr>
                </table>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <table
                  className="table table-striped table-sm table-bordered"
                  style={{ width: "100%" }}
                >
                  <thead style={{ fontWeight: 500 }}>
                    <tr>
                      <td>Type</td>

                      <td style={{ width: "15%" }}>Item Code</td>
                      <td style={{ width: "25%" }}>Description</td>
                      <td>Brand</td>
                      <td>Unit Price</td>
                      <td>Qty.</td>
                      <td>Amount</td>
                      <td>VAT</td>
                    </tr>
                  </thead>
                  <tbody>
                    {printData?.products.map((item, index) => (
                      <tr>
                        <td>PURCHASE</td>
                        <td>{item.product.product_code}</td>
                        <td>{item.product.product_name}</td>
                        <td>{item.product.brand}</td>
                        <td>{item.product.selling_price}</td>
                        <td>{item.sold_quantity}</td>
                        <td>
                          {(
                            item.product.selling_price * item.sold_quantity
                          ).toFixed(3)}
                        </td>
                        <td>
                          {item.vat_applicable
                            ? calculateVat(
                                item.product.selling_price,
                                item.sold_quantity
                              )
                            : "0.000"}
                        </td>
                      </tr>
                    ))}
                    {printData?.customer_orders.map((item, index) => (
                      <tr>
                        <td>ORDER</td>
                        <td>{item.product_code}</td>
                        <td>{item.description}</td>
                        <td>{item.brand}</td>
                        <td>{item.amount}</td>
                        <td>{item.sold_quantity}</td>
                        <td>{(item.amount * item.sold_quantity).toFixed(3)}</td>
                        <td>
                          {item.vat_applicable
                            ? calculateVat(item.amount, item.sold_quantity)
                            : "0.000"}
                        </td>
                      </tr>
                    ))}
                    {printData?.services.map((item, index) => (
                      <tr>
                        <td>SERVICE</td>
                        <td>-</td>
                        <td>{item.description}</td>
                        <td>-</td>
                        <td>{item.amount}</td>
                        <td>-</td>
                        <td>{item.amount}</td>
                        <td>-</td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: "right", fontWeight: 600 }}
                      >
                        Total Amount
                      </td>
                      <td>{(printData?.total_amount).toFixed(3)}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row className="px-2">
              <Col className="d-flex flex-column align-items-end">
                <table className="font-weight-bold">
                  <tr>
                    <td style={{ fontWeight: 600 }}>VAT </td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{(printData?.vat).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Discount</td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{(printData?.discount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Grand Total</td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{(printData?.grand_total).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Paid Amount </td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{(printData?.paidAmount).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Balance</td>
                    <td style={{ width: "20px" }}>:</td>
                    <td>{parseFloat(printData?.balanceAmount).toFixed(3)}</td>
                  </tr>
                </table>
              </Col>
            </Row>
          </main>
          <footer
            className="d-flex flex-column"
            style={{ marginTop: "", marginBottom: "5px", fontWeight: 600 }}
          >
            <div className="d-flex mx-5">
              <div>signature</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center border-top border-secondary">
              <div>
                SULTAN OPTICALS (Main) Al Khuwair Tel: 244 86736, (Branch) Al
                Khuwair Tel: 244 83603
              </div>
              <div>E-mail: sultanopticals@gmail.com</div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
});

export default PrintInvoiceA5;
