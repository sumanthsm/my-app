import React, { Component } from 'react';
import { Route, Router } from 'react-router';
import { createBrowserHistory } from 'history'
import './App.css';
import CreateInvoice from './components/CreateInvoice';
import InvoiceProcessing from './components/InvoiceProcessing';
import InvoiceList from './components/InvoiceList';
import HomePage from './components/HomePage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createBrowserHistory()}>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/createinvoice" component={CreateInvoice} />
          <Route path="/processinvoice" component={InvoiceProcessing} />
          <Route path="/invoicelist" component={InvoiceList} />
        </Router>
      </div>
    );
  }
}

export default App;
