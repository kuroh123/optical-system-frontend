import React from "react";

const PrintBill = React.forwardRef((props, ref) => {
  return (
    <>
      {/* <style type="text/css" media="print">
        {" @page { size: landscape; } "}
      </style> */}
      <div>
        <h1 className="p-5" ref={ref}>
          ---Under Development---
        </h1>
      </div>
    </>
  );
});

export default PrintBill;
