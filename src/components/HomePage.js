import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceImage from '../invoice-image.jpg';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="card" style={{ margin: '50px auto' }}>
                        <div className="card-body">
                            <div className="row" style={{ margin: '0 auto', textAlign : 'center'}}>
                                <div className="card" style={{width:"400px"}}>
                                    <img className="card-img-top" src={InvoiceImage} alt="Card image" style={{width:"100%"}} />
                                    <div className="card-body">
                                        <h4 className="card-title">Create Invoice</h4>
                                        <p className="card-text">Click here to Create a New Invoice</p>
                                        <Link to="/createinvoice" className="btn btn-primary">Create Invoice</Link>
                                    </div>
                                </div>
                                <div className="card" style={{width:"400px"}}>
                                    <img className="card-img-top" src={InvoiceImage} alt="Card image" style={{width:"100%"}}/>
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
            </div>
        );
    }
}
