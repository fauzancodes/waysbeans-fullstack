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
      <h1 className="custom-margin-top product-title font-size-36px mb-5">Income Transaction</h1>
      {
        TransactionsSorted.length > 0 ? (
          <Table responsive bordered hover variant={props.darkMode ? "dark" : "light"} className="mx-auto animate__animated animate__fadeIn">
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
                    <td>{index + 1}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.email}</td>
                    <td>{transaction.phone}</td>
                    <td>{transaction.address}</td>
                    <td>{transaction.products.map((product, index) => <div>{`${product.product_name} x${product.order_quantity}. `}</div>)}</td>
                    <td>{transaction.total_quantity}</td>
                    <td>{transaction.total_price}</td>
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