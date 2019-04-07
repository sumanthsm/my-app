import React, { Component } from 'react';
import { Route, Router } from 'react-router';
import { createBrowserHistory } from 'history'
import './App.css';
import CreateInvoice from './components/CreateInvoice';
import InvoiceProcessing from './components/InvoiceProcessing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createBrowserHistory()}>
          <Route path="/" exact="true" component={CreateInvoice} />
          <Route path="/createinvoice" component={CreateInvoice} />
          <Route path="/processinvoice" component={InvoiceProcessing} />
        </Router>
      </div>
    );
  }
}

export default App;
