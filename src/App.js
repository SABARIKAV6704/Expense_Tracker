// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from './chart';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    if (!name || !datetime || !description) {
      alert('Please fill out all fields');
      return;
    }

    const price = parseFloat(name.split(' ')[0]);
    const transactionName = name.substring(name.indexOf(' ') + 1).trim();

    if (isNaN(price)) {
      alert('The price must be a valid number');
      return;
    }

    const url = process.env.REACT_APP_API_URL + '/transaction';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price,
        name: transactionName,
        description,
        datetime,
      }),
    })
      .then(response => response.json())
      .then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setTransactions(prev => [...prev, json]); // Update transactions list
      })
      .catch(err => {
        console.error('Fetch error:', err);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2); // Ensure balance is a string with two decimal places
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  
  const formattedBalance = `₹${balance}.${fraction}`; // Format balance string with ₹ symbol

  return (
    <main>
      <div className="container">
        <div className="chart-section">
          <Chart transactions={transactions} />
        </div>
        <div className="transactions-section">
          <h1>{formattedBalance}</h1>
          <form onSubmit={addNewTransaction}>
            <div className="basics">
              <input
                type="text"
                id="transactionName"
                name="transactionName"
                value={name}
                onChange={ev => setName(ev.target.value)}
                placeholder={'+amount expense reason'}
              />
              <input
                value={datetime}
                onChange={ev => setDatetime(ev.target.value)}
                type="datetime-local"
                id="transactionDatetime"
                name="transactionDatetime"
              />
            </div>
            <div className="description">
              <input
                type="text"
                id="transactionDescription"
                name="transactionDescription"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder={'description'}
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="add-button">Add Expense</button>
            </div>
          </form>
          <div className="transactions">
            {transactions.length > 0 && transactions.map(transaction => (
              <div className="transaction" key={transaction._id}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                    ₹{transaction.price.toFixed(2)}
                  </div>
                  <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
