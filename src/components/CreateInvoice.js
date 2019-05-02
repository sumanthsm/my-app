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
            // invoiceMessage:null
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
        // else if (e.target.id === 'invoiceMessage') {
        //     this.setState({ invoiceMessage: e.target.value });
        // }
    }

    setInvoiceData = (data) => {
        // console.log(data);
        axios.post('http://localhost:5000/createInvoice', data)
            .then((response) => {

                // console.log(response.data.status,"Swal Confirm");
                if (response.status === 200) {
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
                        // invoiceMessage:''
                    })
                } else if (response.data.status === 'fail') {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Invoice number already exist.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSubmit = (e) => {

        // let invoiceObj = {};
        let recordObj = {};
        // invoiceObj['Key'] = this.state.invoiceNumber;
        // recordObj['docType'] = "invoice";       
        recordObj['invoiceNo'] = this.state.invoiceNumber;
        recordObj['invoiceName'] = this.state.invoiceName;
        recordObj['invoiceDate'] = this.state.invoiceDate;
        recordObj['lob'] = this.state.invoiceLob;
        // recordObj['message']=this.state.invoiceMessage;
        recordObj['quantity'] = this.state.invoiceQuantity;
        recordObj['price'] = this.state.invoicePrice;

        // recordObj['status'] = 'Open';

        // invoiceObj['Record'] = recordObj;

        this.setInvoiceData(recordObj);
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="card" style={{ margin: '50px auto', width: '90%', height: 'auto' }}>
                        <div className="card-body">
                            <h4 className="card-title" >Create Invoice</h4>
                            <hr />
                            <form style={{ marginLeft: '30px' }}>
                                <div className="form-group row">
                                    <label htmlFor="invoiceNumber" className="col-3 col-form-label">Invoice Number</label>
                                    <div className="col-4">
                                        <input type="text" className="form-control" id="invoiceNumber" value={this.state.invoiceNumber} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="invoiceDate" className="col-3 col-form-label">Invoice Date</label>
                                    <div className="col-4">
                                        <input type="date" className="form-control" id="invoiceDate" value={this.state.invoiceDate} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="invoiceName" className="col-3 col-form-label">Invoice Name</label>
                                    <div className="col-4">
                                        <input type="text" className="form-control" id="invoiceName" value={this.state.invoiceName} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="invoiceLob" className="col-3 col-form-label">Line Of Business(LOB)</label>
                                    <div className="col-4">
                                        <input type="text" className="form-control" id="invoiceLob" value={this.state.invoiceLob} onChange={this.handleChange} />
                                    </div>
                                </div>
                                {/* <div className="form-group row">
                            <label htmlFor="invoiceMessage" className="col-3 col-form-label">Message</label>
                            <div className="col-4">
                                <input type="text" className="form-control" id="invoiceMessage" value={this.state.invoiceMessage} onChange={this.handleChange} />
                            </div>
                        </div> */}
                                <div className="form-group row">
                                    <label htmlFor="invoiceQuantity" className="col-3 col-form-label">Quantity</label>
                                    <div className="col-4">
                                        <input type="number" className="form-control" id="invoiceQuantity" value={this.state.invoiceQuantity} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="invoicePrice" className="col-3 col-form-label">Price</label>
                                    <div className="col-4">
                                        <input type="text" className="form-control" id="invoicePrice" value={this.state.invoicePrice} onChange={this.handleChange} />
                                    </div>
                                </div>
                            </form>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}
