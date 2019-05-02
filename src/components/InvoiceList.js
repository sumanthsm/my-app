import React from 'react';
import axios from 'axios';

export default class InvoiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceNo : 0,
            invoiceData: null,
            disableFilter: '',
            disableInput: ''
        }
    }

    componentDidMount() {
        this.getInvoiceData();
    }

    handleChange = (event) => {
        if (event.target.value === '') {
            this.getInvoiceData();
        }
        this.setState({ invoiceNo: event.target.value, disableFilter: 'disabled' });
    }

    handleSort = (event) => {
        console.log(event.target.value, "event.target.value");
        const invoiceFilterName = event.target.value;
        if (invoiceFilterName === 'Status' || invoiceFilterName === 'All') {
            this.getInvoiceData();
        } else {
            this.getInvoiceDataByFilterName(invoiceFilterName);
        }
        this.setState({ disableInput: 'disabled' });
    }

    getInvoiceDataByID = () => {
        axios.get('http://localhost:5000/api/invoice' + this.state.invoiceNo)
            .then((response) => {
                let result = [];
                let invoiceObj ={};
        
                let data = JSON.parse(response.data.result);
                invoiceObj['Key']=data.invoiceNo;
                invoiceObj['Record']= data;
                console.log(invoiceObj);
                result.push(invoiceObj);

                this.setState({ invoiceData: result });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getInvoiceDataByFilterName = (invoiceFilterName) => {
        let filterName = invoiceFilterName;
        if(filterName == 'Disputed'){
            filterName = "Not Approved";

        }
        axios.get('http://localhost:5000/api/filterbystatus' + filterName)
            .then((response) => {
                console.log(response, "res");
                let data = response.data;
                this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    getInvoiceData = () => {
        axios.get('http://localhost:5000/invoices')
            .then((response) => {  
                let data = response.data.result;
                this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log("error nessage ---->",error.message);
            })
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="card" style={{ margin: '50px auto' }}>
                        <div className="card-body">
                            <h4 className="card-title" >INVOICE LIST</h4>
                            <hr />
                            <div className="row">
                                <div className="col-lg-6 col-md-4">
                                    <form className="form-inline">
                                        <div className="input-group" style={{ margin: '0px 0px 0px auto' }}>
                                            <label htmlFor="invoicenumber" className="mb-2 mr-sm-2">Invoice No:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="invoicenumber"
                                                placeholder="Invoice Number"
                                                name="invoicenumber"
                                                disabled={this.state.disableInput}
                                                onChange={this.handleChange} />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    style={{backgroundColor :"#87cefa" }}
                                                    onClick={this.getInvoiceDataByID}
                                                >Go</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-lg-6 col-md-4">
                                    <form className="form-inline">
                                        <div className="input-group">
                                            <label htmlFor="sortby" className="mb-2 mr-sm-2">Search by:</label>
                                            <select id="sortby" className="form-control" disabled={this.state.disableFilter} onChange={this.handleSort}>
                                                <option>Status</option>
                                                <option>All</option>
                                                {/* <option>Open</option> */}
                                                <option style={{ backgroundColor : "#00ff7f"}}>Approved</option>
                                                <option style={{ backgroundColor : "#ff6347"}}>Disputed</option>
                                                <option style={{ backgroundColor : "#f0e68c"}}>Pending</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>

                            </div>
                            <div style={{ margin: ' 30px 30px 0px 30px' }}>
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
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
                                                        <td style={{ width: '100px' }}>{record.message}</td>
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
