import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Map from './Map';

function App() {
  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [street, setStreet] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const response = await axios.get('http://localhost:5000/api/coordinates');
      setCoordinates(response.data);
    };
    fetchCoordinates();
  }, []);

  useEffect(() => {
    async function fetchDeliveries() {
      const response = await axios.get('http://localhost:5000/api/deliveries');
      setDeliveries(response.data);
    }
    fetchDeliveries();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const newDelivery = {
      Order: order,
      Name: name,
      Email: email,
      Mobile: mobile,
      Street: street,
      HouseNo: houseNo,
      City: city,
      PinCode: pinCode
    };
    const response = await axios.post('http://localhost:5000/api/deliveries', newDelivery);
    setDeliveries([...deliveries, response.data]);
    setOrder('');
    setName('');
    setEmail('');
    setMobile('');
    setStreet('');
    setHouseNo('');
    setCity('');
    setPinCode('');
  }

  return (
    <>
    <div className="App">
      <h1>Delivery Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="order">Order:</label>
        <select id="order" name="order" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="">Select Pizza</option>
          <option value="Pepperoni Pizza">Pepperoni Pizza</option>
          <option value="Margherita Pizza">Margherita Pizza</option>
          <option value="Mushroom Pizza">Mushroom Pizza</option>
          <option value="Hawaiian Pizza">Hawaiian Pizza</option>
          <option value="BBQ Chicken Pizza">BBQ Chicken Pizza</option>
        </select>

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="mobile">Mobile:</label>
        <input type="text" id="mobile" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <label htmlFor="street">Street:</label>
        <input type="text" id="street" name="street" value={street} onChange={(e) => setStreet(e.target.value)} />

        <label htmlFor="houseNo">House No:</label>
        <input type="text" id="houseNo" name="houseNo" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />

        <label htmlFor="city">City:</label>
        <input type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} />

        <label htmlFor="pinCode">Pin Code:</label>
        <input type="text" id="pinCode" name="pinCode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />

        <button type="submit">Submit</button>
      </form>

      <h1>Deliveries</h1>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Street</th>
            <th>House No</th>
            <th>City</th>
            <th>Pin Code</th>
            <th>Destination Latititude</th>
            <th>Destination Longitude</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery._id}>
              <td>{delivery.Order}</td>
              <td>{delivery.Name}</td>
              <td>{delivery.Email}</td>
              <td>{delivery.Mobile}</td>
              <td>{delivery.Street}</td>
              <td>{delivery.HouseNo}</td>
              <td>{delivery.City}</td>
              <td>{delivery.PinCode}</td>
              <td>{delivery.EndCoordinates.Latitude}</td>
              <td>{delivery.EndCoordinates.Longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div>
    <Map coordinates={coordinates} />
    </div>
    </>
  );
}

export default App;
