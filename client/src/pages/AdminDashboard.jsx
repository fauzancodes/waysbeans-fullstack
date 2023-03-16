import { Container, Table } from 'react-bootstrap';

export default function ProductDetails(props) {
  document.title = "Admin Dashboard | WaysBeans";

  let TransactionsSorted = [];
  if (props.Transactions !== undefined) {
    TransactionsSorted = [...props.Transactions];
    TransactionsSorted.sort((a, b) => b.date - a.date);
  }

  return (
    <Container>
      <h1 className={`custom-margin-top ${props.darkMode ? "fw-bold text-light text-center" : "product-title"} font-size-36px mb-5`}style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }} >Income Transaction</h1>
      {
        TransactionsSorted.length > 0 ? (
          <Table responsive bordered hover className="mx-auto animate__animated animate__fadeIn">
            <thead style={{ backgroundColor:"#E5E5E5" }}>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Products Order</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                TransactionsSorted.map((transaction, index) => (
                  <tr key={index}>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{index + 1}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.name}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.email}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.phone}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.address}</td>
                    <td>{transaction.products.map((product, index) => <div style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{`${product.product_name} x${product.order_quantity}. `}</div>)}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.total_quantity}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.total_price}</td>
                    {
                      transaction.status === "pending" && <td style={{ color:"#FF9900" }}>{transaction.status}</td>
                    }
                    {
                      transaction.status === "success" && <td style={{ color:"#78A85A" }}>{transaction.status}</td>
                    }
                    {
                      transaction.status === "failed" && <td style={{ color:"#E83939" }}>{transaction.status}</td>
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        ) : <p className="opacity-50">There are no transactions to display.</p>
      }
    </Container>
  )
}