import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
// import { url } from 'inspector';

export default class InvoiceProcessing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceNo: 0,
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

        console.log("inside Get invoice Data..");

        setTimeout(() => {
            axios.get('http://localhost:5000/invoices')
                .then((response) => {
                    console.log(response.data.result, "response in getinvoice Data...");
                    let data = response.data.result;
                    this.setState({ invoiceData: data });
                })
                .catch(function (error) {
                    console.log("error nessage ---->", error.message);
                })
        }, 2000);
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

    setInvoiceDataById = (data, status) => {
        let url = "";
        if (status === "Approved") {
            url = "http://localhost:5000/approveInvoice";

        } else if (status === "Disputed") {
            url = "http://localhost:5000/disputeInvoice";
        }
        console.log(url);

        for (let i = 0; i < data.length; i++) {

            axios.post(url, { invoiceNo: data[i].id, status: status })
                .then((response) => {
                    console.log(response, "SetInvoiceData By ID.....");
                    if (response.status == 200) {
                        // this.setState({isLoaded : true})


                        this.getInvoiceData();
                        Swal.fire({
                            type: 'success',
                            title: 'Data submitted successfully.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        //    setTimeout(this.getInvoiceData(),5000);

                    }
                    console.log(response, "res");
                    // let data = response.data;
                    // this.setState({ invoiceData: data });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

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
                <div className="card" style={{ margin: '50px auto' }}>
                    <div className="card-body">
                        <h4 className="card-title" >INVOICE PROCESSING</h4>
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
                                    <thead className="thead-light" >
                                        <tr>
                                            <th style={{ width: '50px', backgroundColor : "#f5deb3" ,color : "#8b4513"}}></th>
                                            <th style={{ width: '120px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>Invoice No.</th>
                                            <th style={{ width: '140px' , backgroundColor : "#f5deb3",color : "#8b4513" }}>Invoice Date</th>
                                            <th style={{ width: '295px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>Invoice Name</th>
                                            <th style={{ width: '255px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>LoB</th>
                                            <th style={{ width: '95px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>Quantity</th>
                                            <th style={{ width: '90px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>Price</th>
                                            <th style={{ width: '100px' , backgroundColor : "#f5deb3",color : "#8b4513"}}>Status</th>
                                            <th style = {{backgroundColor :"#f5deb3",color : "#8b4513" }}>Comments</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div style={{ margin: '-15px 30px 0px 30px', height: '400px', overflowY: 'auto', borderBottom: '1px solid #dee2e6' }}>
                                <table className="table table-bordered">

                                    <tbody >


                                        {this.state.invoiceData != null ?
                                            this.state.invoiceData.map((invoice, i) => {
                                                let record = invoice.Record;
                                                // console.log("record response", record)


                                                if(record.status == "Not Approved"){
                                                    record.status = "Disputed";
                                                }
                                                return (
                                                    <tr key={i} >
                                                        <td style={{ width: '50px' }}><input
                                                            type="checkbox"
                                                            key={record.invoiceNo}
                                                            id={record.invoiceNo}
                                                            onChange={() => this.onOptionChange(record.invoiceNo)}
                                                            checked={this.state.selected[record.invoiceNo] === true} />
                                                        </td>
                                                        <td style={{ width: '120px' }}>{record.invoiceNo}</td>
                                                        <td style={{ width: '140px' }}>{record.invoiceDate}</td>
                                                        <td style={{ width: '295px' }}>{record.invoiceName}</td>
                                                        <td style={{ width: '255px' }}>{record.lob}</td>
                                                        <td style={{ width: '95px' }}>{record.quantiy}</td>
                                                        <td style={{ width: '90px' }}>{record.price}</td>
                                                        <td style={{ width: '100px' }}>{record.status}</td>
                                                        <td >
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="comments"
                                                                placeholder="Enter comments here"
                                                                name="comments"
                                                                // value = {record.message}
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

                            <div className="col-lg-12 mt-5 mb-3">
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
                </div>
            </div>
        );
    }
}
