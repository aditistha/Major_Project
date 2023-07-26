import React, { useEffect, useState } from "react";
import "./KitchenDash.css";
import { FaBell } from "react-icons/fa";
import io from "socket.io-client"; 
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "react-bootstrap";
import { updateOrderStatus } from "../../../api/userAction";


const KitchenDash = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clickedDone, setClickedDone] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("newOrder", (order) => {
      console.log("Received new order:", order);
      setOrders((prevOrders) => [order, ...prevOrders]);
    });
    socket.on("orderDoneNotification", (order) => {
      console.log("Received order done notification:", order);
      // Find the order in the state and update its status to 'done'
      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.code === order.code ? { ...prevOrder, cart: order.cart } : prevOrder
        )
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleTableButtonClick = (order) => {
    setSelectedOrder((prevOrder) => (prevOrder === order ? null : order));
  };

  const handleOrderDone = (orderCode, itemId, table_number) => {
    updateOrderStatus(itemId, table_number)
      .then((response) => {
        // Handle success response if needed
        console.log('Order status updated:', response.data);
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.code === orderCode) {
              const updatedCart = order.cart.map((item) => {
                if (item.menu_id === itemId) {
                  return { ...item, status: 'done' };
                }
                return item;
              });
              return { ...order, cart: updatedCart };
            }
            return order;
          })
        );
      })
      .catch((error) => {
        // Handle error response if needed
        console.error('Error updating order status:', error);
      });
  };
  const handleOrderCancel = (orderCode, itemId, table_number) => {
    updateOrderStatus(itemId, table_number)
      .then((response) => {
        // Handle success response if needed
        console.log('Order status updated:', response.data);
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.code === orderCode) {
              const updatedCart = order.cart.filter((item) => item.menu_id !== itemId);
              if (updatedCart.length === 0) {
                return null; // Remove the order from the list
              }
              return { ...order, cart: updatedCart };
            }
            return order;
          }).filter(Boolean) // Filter out null orders
        );
      })
      .catch((error) => {
        // Handle error response if needed
        console.error('Error updating order status:', error);
      });
  };
  const socket = io("http://localhost:8000");
  

  const handleallDone = (orderCode, itemId, table_number) => {
    updateOrderStatus(itemId, table_number)
      .then((response) => {
        console.log("Order status updated:", response.data);
  
        // Find the specific table order
        const order = orders.find((order) => order.code === orderCode);
  
        if (order) {
          // Emit the "orderDoneNotification" event for this table
          socket.emit("orderDoneNotification", {
            tableNumber: order.table_number[0],
            cart: order.cart,
          });
        }
  
        // Remaining code to update orders and status as needed
        // ...
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  console.log("Orders in KitchenDash:", orders);

  // ...

  

  


  const remainingOrders = orders.filter((order) => order.cart.length > 0);
  const allOrdersDone = remainingOrders.length === 0;

  return (
    <div className="MainDash">
      <div className="title-icon mb-5 mt-5 dflex">
        <h1>Kitchen Dashboard</h1>
        <div className="bell-icons">
          <div className="bell-icon">
            <FaBell style={{ fontSize: "50px" }} />
            <span>{orders.length}</span>
          </div>
        </div>
      </div>
      <h3 className="cashrecent">Recent Orders</h3>

      <div className="order-table">
        {orders.map((order) => (
          <div key={order.code}>
            <Button
              variant="secondary"
              className={`table-button ${
                selectedOrder === order ? "selected" : ""
              }`}
              onClick={() => handleTableButtonClick(order)}
            >
              Table {order.table_number[0]}
            </Button>
            {selectedOrder === order && (
              <div className="order-details">
               
                  <Button
                              className="bg-success"
                              style={{ border: "none" }}
                              onClick={() =>
                                handleallDone()
                              }
                            >
                              Done
                            </Button>
                <TableContainer
                  component={Paper}
                  style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow className="kitchenorderrow">
                        <TableCell  className="border">Ordered item</TableCell>
                        <TableCell align="left"  className="border">Quantity</TableCell>
                        <TableCell align="left"  className="border">Status</TableCell>
                        <TableCell align="left"  className="border">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ color: "white" }}>
                      {order.cart.map((item) => (
                        <TableRow
                          key={item.menu_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row"  className="border">
                            {item.item_name}
                          </TableCell>
                          <TableCell align="left"  className="border">{item.quantity}</TableCell>
                          <TableCell align="left">
                            <span className="status border" >pending</span>
                          </TableCell>
                          <TableCell align="left"  className="border">
                            <Button
                              className="bg-success"
                              style={{ border: "none" }}
                              onClick={() =>
                                handleOrderDone(order.code, item.menu_id, order.table_number[0])
                              }
                            >
                              Done
                            </Button>
                            {item.status !== 'done' && (
                              <Button
                                className="bg-danger"
                                style={{ border: "none" }}
                                onClick={() =>
                                  handleOrderCancel(order.code, item.menu_id, order.table_number[0])
                                }
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        ))}
        {allOrdersDone && (
          <div className="no-orders">No orders remaining.</div>
        )}
      </div>
    </div>
  );
};

export default KitchenDash;
