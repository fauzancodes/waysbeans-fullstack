import { Container, Table } from 'react-bootstrap';

export default function ProductDetails(props) {
  document.title = "Admin Dashboard | WaysBeans";

  let TransactionsSorted = [];
  if (props.Transactions !== undefined) {
    TransactionsSorted = [...props.Transactions];
    TransactionsSorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <Container className="mb-5">
      <h1 className={`custom-margin-top ${props.darkMode ? "fw-bold text-light text-center" : "product-title"} font-size-36px mb-5`}style={{ backgroundColor: props.darkMode ? "#613D2B" : "transparent", padding: props.darkMode ? "1rem" : "0" }}>Income Transaction</h1>
      {
        TransactionsSorted.length > 0 ? (
          <Table responsive bordered hover className="mx-auto w-100 animate__animated animate__fadeIn">
            <thead style={{ backgroundColor:"#E5E5E5" }}>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Name</th>
                <th className="text-center">Email</th>
                <th className="text-center">Phone Number</th>
                <th className="text-center">Address</th>
                <th className="text-center">Products Order</th>
                <th className="text-center">Date</th>
                <th className="text-center">Total Quantity</th>
                <th className="text-center">Total Price</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {
                TransactionsSorted.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{index + 1}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.name}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.email}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.phone}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>{transaction.address}</td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>
                      <ol className="ps-3">
                        {transaction.products.map((product, index) => (
                          <li key={index} className="mb-2" style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>
                            {product.product_name}, {product.product_price.toLocaleString("id-ID", {style: "currency",currency: "IDR"})}, x{product.order_quantity}
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td style={{ color: props.darkMode ? "#FFFFFF" : "#000000" }}>
                      {`${new Date(transaction.date).getDate()} ${months[new Date(transaction.date).getMonth()]} ${new Date(transaction.date).getFullYear()}`}
                    </td>
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
        ) : <p className={`${props.darkMode && "text-light"} opacity-50`}>There are no transactions to display.</p>
      }
    </Container>
  )
}