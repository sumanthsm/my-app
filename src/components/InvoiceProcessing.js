import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

export default class InvoiceProcessing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceNum: 0,
            invoiceData: null,
            disableFilter: '',
            disableInput: '',
            selected: {},
            comments: {},
            status: null,
            isLoaded: false
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
                this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange = (event) => {
        if (event.target.value === '') {
            this.getInvoiceData();
        }
        this.setState({ invoiceNum: event.target.value, disableFilter: 'disabled' });
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
        axios.get('http://localhost:5000/api/invoice' + this.state.invoiceNum)
            .then((response) => {
                console.log(response, "res");
                let data = response.data;
                this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getInvoiceDataByFilterName = (invoiceFilterName) => {
        axios.get('http://localhost:5000/api/filterbystatus' + invoiceFilterName)
            .then((response) => {
                console.log(response, "res");
                let data = response.data;
                this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setInvoiceDataById = (data, status) => {
        axios.post('http://localhost:5000/api/invoice', { data: data, status: status })
            .then((response) => {
                if (response.data.status === 'success') {
                    // this.setState({isLoaded : true})
                    this.getInvoiceData();
                    Swal.fire({
                        type: 'success',
                        title: 'Data submitted successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                console.log(response, "res");
                // let data = response.data;
                // this.setState({ invoiceData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onOptionChange = (id) => {
        const newSelected = Object.assign({}, this.state.selected);
        console.log(newSelected, "newSelected");

        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected
        });
    }

    handleStatusChange = (e) => {
        this.setState({ status: e.target.value })
    }

    handleSubmit = () => {
        let selectedData = [],
            data = this.state.selected,
            status = this.state.status;

        if (Object.keys(data).length > 0) {
            if (status != null) {
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let key = Object.keys(data)[i]
                    if (data[key] === true) {
                        selectedData.push({ 'id': key });
                    }
                    console.log(key, data[key]);
                }
                this.setInvoiceDataById(selectedData, this.state.status);
                this.setState({ invoiceNum: '', disableFilter: false, disableInput: false, selected: {} });
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Please select the status.',
                })
            }
        } else {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Please select atleast one invoice record.',
            })
        }

    }

    addComments = (id, event) => {
        const newComment = Object.assign({}, this.state.comments);
        console.log(newComment, "newSelected");

        newComment[id] = event.target.value;
        this.setState({
            comments: newComment
        });
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div style={{ fontSize: '18px', fontWeight: '600', paddingTop: '15px' }}>INVOICE PROCESSING</div>
                </div>
                <hr />
                <div className="container-fluid">
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
                                        <option>Open</option>
                                        <option>Approved</option>
                                        <option>Disputed</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div style={{ margin: ' 30px 30px 0px 30px' }}>
                        <table className="table table-bordered">
                        <thead className="thead-light">
                                <tr>
                                <th style={{width: '50px'}}></th>
                                        <th style={{width: '120px'}}>Invoice No.</th>
                                        <th style={{width: '140px'}}>Invoice Date</th>
                                        <th style={{width: '295px'}}>Invoice Name</th>
                                        <th style={{width: '255px'}}>LoB</th>
                                        <th style={{width: '95px'}}>Quantity</th>
                                        <th style={{width: '69px'}}>Price</th>
                                        <th style={{width: '100px'}}>Status</th>
                                        <th >Comments</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{ margin: '-15px 30px 0px 30px', height: '300px', overflowY: 'auto', borderBottom: '1px solid #dee2e6' }}>
                        <table className="table table-bordered">
                            
                            <tbody >
                                {this.state.invoiceData != null ?
                                    this.state.invoiceData.map((invoice, i) => {
                                        return (
                                            <tr key={i} >
                                                <td style={{width: '50px'}}><input
                                                    type="checkbox"
                                                    key={`invoice${i}`}
                                                    id={invoice.id}
                                                    onChange={() => this.onOptionChange(invoice.id)}
                                                    checked={this.state.selected[invoice.id] === true} />
                                                </td>
                                                <td style={{width: '120px'}}>{invoice.id}</td>
                                                <td style={{width: '140px'}}>{invoice.Invoice_Date}</td>
                                                <td style={{width: '295px'}}>{invoice.Invoice_name}</td>
                                                <td style={{width: '255px'}}>{invoice.Line_of_business}</td>
                                                <td style={{width: '95px'}}>{invoice.Quantity}</td>
                                                <td style={{width: '69px'}}>{invoice.Price}</td>
                                                <td style={{width: '100px'}}>{invoice.Status}</td>
                                                <td >
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="comments"
                                                        placeholder="Enter comments here"
                                                        name="comments"
                                                        onChange={(e) => this.addComments(invoice.id, e)} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : ""
                                }
                            </tbody>
                        </table>
                    </div>
                   
                    <div className="col-lg-12 mt-3 mb-3">
                        <div className="row" >
                            <div className="col-lg-6" style={{ textAlign: 'right' }}>
                                <select id="statuschange" className="form-control" style={{ width: 'auto', margin: '0 0 0 auto' }} onChange={this.handleStatusChange}>
                                    <option>Change Status</option>
                                    <option>Open</option>
                                    <option>Approved</option>
                                    <option>Disputed</option>
                                </select>
                            </div>
                            <div className="col-lg-6">
                                <button type="button" className="btn btn-primary ml-2 mr-2" onClick={this.handleSubmit} >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
