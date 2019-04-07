import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

export default class CreateInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceNumber: null,
            invoiceDate: null,
            invoiceName: null,
            invoiceLob: null,
            invoiceQuantity: null,
            invoicePrice: null
        }
    }

    handleChange = (e) => {
        if (e.target.id === 'invoiceNumber') {
            this.setState({ invoiceNumber: e.target.value });
        } else if (e.target.id === 'invoiceDate') {
            this.setState({ invoiceDate: e.target.value });
        } else if (e.target.id === 'invoiceName') {
            this.setState({ invoiceName: e.target.value });
        } else if (e.target.id === 'invoiceLob') {
            this.setState({ invoiceLob: e.target.value });
        } else if (e.target.id === 'invoiceQuantity') {
            this.setState({ invoiceQuantity: e.target.value });
        } else if (e.target.id === 'invoicePrice') {
            this.setState({ invoicePrice: e.target.value });
        }
    }

    setInvoiceData = (data) => {
        axios.post('http://localhost:5000/api/createinvoice', { data: data })
            .then((response) => {
                if (response.data.status === 'success') {
                    Swal.fire({
                        type: 'success',
                        title: 'Invoice created successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.setState({
                        invoiceNumber: '',
                        invoiceDate: '',
                        invoiceName: '',
                        invoiceLob: '',
                        invoiceQuantity: '',
                        invoicePrice: ''
                    })
                }else if (response.data.status === 'fail') {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Invoice number is already exist.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSubmit = (e) => {
        let invoiceObj = {};
        invoiceObj['id'] = this.state.invoiceNumber;
        invoiceObj['Invoice_Date'] = this.state.invoiceDate;
        invoiceObj['Invoice_name'] = this.state.invoiceName;
        invoiceObj['Line_of_business'] = this.state.invoiceLob;
        invoiceObj['Price'] = this.state.invoicePrice;
        invoiceObj['Quantity'] = this.state.invoiceQuantity;
        invoiceObj['Status'] = 'Open';
        this.setInvoiceData(invoiceObj);
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div style={{ fontSize: '18px', fontWeight: '600', paddingTop: '15px' }}>Create Invoice</div>
                </div>
                <hr />
                <div className="container-fluid">
                    <form style={{ marginLeft: '30px' }}>
                        <div className="form-group row">
                            <label htmlFor="invoiceNumber" className="col-sm-2 col-form-label">Invoice Number</label>
                            <div className="col-lg-3">
                                <input type="text" className="form-control" id="invoiceNumber" value={this.state.invoiceNumber} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="invoiceDate" className="col-sm-2 col-form-label">Invoice Date</label>
                            <div className="col-lg-3">
                                <input type="date" className="form-control" id="invoiceDate" value={this.state.invoiceDate} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="invoiceName" className="col-sm-2 col-form-label">Invoice Name</label>
                            <div className="col-lg-3">
                                <input type="text" className="form-control" id="invoiceName" value={this.state.invoiceName} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="invoiceLob" className="col-sm-2 col-form-label">Line Of Business(LOB)</label>
                            <div className="col-lg-3">
                                <input type="text" className="form-control" id="invoiceLob" value={this.state.invoiceLob} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="invoiceQuantity" className="col-sm-2 col-form-label">Quantity</label>
                            <div className="col-lg-3">
                                <input type="number" className="form-control" id="invoiceQuantity" value={this.state.invoiceQuantity} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="invoicePrice" className="col-sm-2 col-form-label">Price</label>
                            <div className="col-lg-3">
                                <input type="text" className="form-control" id="invoicePrice" value={this.state.invoicePrice} onChange={this.handleChange} />
                            </div>
                        </div>
                    </form>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}
