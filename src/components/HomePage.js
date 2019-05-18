import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceImage from '../invoice-image.png';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                            <span style={{ color: 'white', padding: '12px 0px' }}>Invoice management system</span>
                        </nav>
                <div className="container-fluid">
                    <div style={{margin: '20px auto'}}>
                    <div className="row" style={{ margin: '0 auto', textAlign : 'center'}}>
                                <div className="card" style={{width:"300px", margin: '20px', borderRadius: '20px'}}>
                                    <img className="card-img-top" src={InvoiceImage} alt="Card image" style={{width:"50%", margin: '10px auto'}} />
                                    <div className="card-body">
                                        <h4 className="card-title">Create Invoice</h4>
                                        <p className="card-text">Click here to Create a New Invoice</p>
                                        <Link to="/createinvoice" className="btn btn-primary">Create Invoice</Link>
                                    </div>
                                </div>
                                <div className="card" style={{width:"300px", margin: '20px', borderRadius: '20px'}}>
                                    <img className="card-img-top" src={InvoiceImage} alt="Card image" style={{width:"50%", margin: '10px auto'}}/>
                                    <div className="card-body">
                                        <h4 className="card-title">Invoice List</h4>
                                        <p className="card-text">Click here to View all the Invoices</p>
                                        <Link to="/invoicelist" className="btn btn-primary">Invoice List</Link>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}
