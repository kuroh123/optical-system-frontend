import { Form } from "react-bootstrap";

const { default: DataTable } = require("react-data-table-component");

const ProductTable = ({ data, setData }) => {
  const columns = [
    {
      name: "Code",
      selector: (row) => row.product_code,
    },
    {
      name: "Name",
      selector: (row) => row.product_name,
      wrap: true,
    },
    {
      name: "Category",
      selector: (row) => row.product_category,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
    },
    {
      name: "Product for",
      selector: (row) => row.product_for,
    },
    {
      name: "Stock qty",
      selector: (row) => row.current_quantity,
    },
    {
      name: "Price",
      selector: (row) => row.selling_price,
    },
    {
      name: "Sold qty",
      selector: null,
      width: "100px",
      cell: (row, index) => {
        return (
          <Form.Control
            autoComplete="off"
            name="quantity"
            type="number"
            size="sm"
            onChange={(e) => {
              let x = [...data];
              x[index].sold_quantity = parseInt(e.target.value);
              console.log(x);
              setData(x);
            }}
            defaultValue={row.sold_quantity}
          />
        );
      },
    },
    {
      name: "Discount",
      selector: null,
      width: "100px",
      cell: (row, index) => {
        return (
          <Form.Control
            autoComplete="off"
            name="discount"
            type="number"
            size="sm"
            onChange={(e) => {
              let x = [...data];
              // x[index].discount = parseFloat(e.target.value).toFixed(3);
              x[index].discount = parseFloat(e.target.value);
              console.log(x);
              setData(x);
            }}
            defaultValue={row.discount}
          />
        );
      },
    },
    {
      name: "VAT",
      selector: null,
      width: "100px",
      cell: (row, index) => {
        return (
          <Form.Select
            name="vat_applicable"
            as="select"
            size="sm"
            onChange={(e) => {
              let x = [...data];
              x[index].vat_applicable = e.target.value;
              console.log(x);
              setData(x);
            }}
          >
            <option selected defaultValue>
              No
            </option>
            <option>Yes</option>
          </Form.Select>
        );
      },
    },
  ];
  return <DataTable data={data} columns={columns} dense responsive />;
};

export default ProductTable;
