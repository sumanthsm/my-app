import React from 'react';
import axios from 'axios';

export default class InvoiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceData: null
        }
    }

    componentDidMount() {
        this.getInvoiceData();
    }

    getInvoiceData = () => {
        axios.get('http://localhost:5000/api/invoice')
            .then((response) => {
                console.log(response, "res");
                let data = response.data;
                this.setState({ invoiceData: data.result });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="card" style={{ margin: '50px auto' }}>
                        <div className="card-body">
                            <h4 className="card-title" >INVOICE LIST</h4>
                            <hr />
                            <div style={{ margin: ' 30px 30px 0px 30px' }}>
                                <table className="table table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{ width: '120px' }}>Invoice No.</th>
                                            <th style={{ width: '140px' }}>Invoice Date</th>
                                            <th style={{ width: '295px' }}>Invoice Name</th>
                                            <th style={{ width: '255px' }}>LoB</th>
                                            <th style={{ width: '95px' }}>Quantity</th>
                                            <th style={{ width: '90px' }}>Price</th>
                                            <th style={{ width: '100px' }}>Status</th>
                                            <th >Comments</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div style={{ margin: '-15px 30px 0px 30px', height: '450px', overflowY: 'auto', borderBottom: '1px solid #dee2e6' }}>
                                <table className="table table-bordered" style={{margin: '0px'}}>
                                    <tbody >
                                        {this.state.invoiceData != null ?
                                            this.state.invoiceData.map((invoice, i) => {
                                                let record = invoice.Record;
                                                return (
                                                    <tr key={i} >
                                                        <td style={{ width: '120px' }}>{record.invoiceNo}</td>
                                                        <td style={{ width: '140px' }}>{record.invoiceDate}</td>
                                                        <td style={{ width: '295px' }}>{record.invoiceName}</td>
                                                        <td style={{ width: '255px' }}>{record.lob}</td>
                                                        <td style={{ width: '95px' }}>{record.quantity}</td>
                                                        <td style={{ width: '90px' }}>{record.price}</td>
                                                        <td style={{ width: '100px' }}>{record.status}</td>
                                                        <td>Comment</td>
                                                    </tr>
                                                )
                                            })
                                            : ""
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
