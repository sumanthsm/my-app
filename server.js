const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios');
const json2csv = require('json2csv').parse;
var csvjson = require('csvjson');
var fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function convertToJson() {
    let csvData = [];
    var options = {
        delimiter: ',', // optional
        quote: '"' // optional
    };
    var file_data = fs.readFileSync('./assets/mock-data.csv', { encoding: 'utf8' });
    csvData = csvjson.toObject(file_data, options);
    return csvData;
}

app.get('/api/invoice', (req, res) => {
    const data = convertToJson();
    res.json(data);
});

// app.get('/api/invoice:id', (req, res) => {
//     let result = [];
//     let csvData = convertToJson();
//     for (let i = 0; i < csvData.length; i++) {
//         if (csvData[i].id === req.params.id) {
//             result.push(csvData[i]);
//         }
//     }
//     res.json(result);
// });

app.get('/api/filterbystatus:status', (req, res) => {

    axios.get('http://fb-invoice-reconciliation-api.mybluemix.net/invoices')

        .then((response) => {
            let result = [];
            invoiceData = response.data.result;
            for (let i = 0; i < invoiceData.length; i++) {
                if (invoiceData[i]['Record']['status'] === req.params.status) {
                    result.push(invoiceData[i]);
                }
            }
            res.send(result);

        })
        .catch((error) => {
            res.send(error);
        })

});

app.post('/api/invoice', (req, res) => {
    let result = [];
    const fields = ['id', 'Invoice_Date', 'Invoice_name', 'Line_of_business', 'Price', 'Quantity', 'Status'];
    const opts = { fields };
    let jsonData = convertToJson();
    const selectedData = req.body.data;
    for (let i = 0; i < selectedData.length; i++) {
        for (let j = 0; j < jsonData.length; j++) {
            if (jsonData[j]['id'] === selectedData[i]['id']) {
                jsonData[i]['Status'] = req.body.status;
                result.push(jsonData[j]);
            } else {
                result.push(jsonData[j]);
            }
        }
    }
    fs.writeFile("./assets/mock-data.csv", json2csv(result, opts), function (err) {
        if (err) {
            throw err;
        }
    });
    res.json({ 'status': 'success' });
});

app.post('/api/createinvoice', (req, res) => {
    const fields = ['id', 'Invoice_Date', 'Invoice_name', 'Line_of_business', 'Price', 'Quantity', 'Status'];
    const opts = { fields };
    let flag = 0;
    let jsonData = convertToJson();
    const newInvoiceData = req.body.data;
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]['id'] === newInvoiceData['id']) {
            flag = 1;
            break;
        }
    }

    if (flag === 0) {

        jsonData.push(newInvoiceData);
        fs.writeFile("./assets/mock-data.csv", json2csv(jsonData, opts), function (err) {
            if (err) {
                throw err;
            }
        });
        res.json({ 'status': 'success' });
    } else {
        res.json({ 'status': 'fail' });
    }
});


app.get("/invoices", (req, res) => {
    axios.get("http://fb-invoice-reconciliation-api.mybluemix.net/invoices")
        .then(({ data }) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).json({ errormessage: err.message });
        });
});

//createinvoice post method
app.post("/createInvoice", (req, res) => {
    axios.post("https://fb-invoice-reconciliation-api.mybluemix.net/createInvoice", req.body)
        .then((response) => {
            res.send(response.data);
        })
        .catch(function (error) {
        });
});


app.get('/api/invoice:id', (req, res) => {

    console.log(req.params.id,"Request params...");
    axios.get("http://fb-invoice-reconciliation-api.mybluemix.net/getinvoice?invoiceNo="+req.params.id)
        .then((response) => {
            console.log(response,"Response by ID....");
            
            res.send(response.data);
        })
        .catch(err => {
            res.status(500).json({ errormessage: err.message });
        });
});

app.post('/approveInvoice', (req, res) => {
    let invoiceData = [];

    const invoiceNo = req.body.invoiceNo;
    axios.get('http://fb-invoice-reconciliation-api.mybluemix.net/invoices')
        .then((response) => {
            invoiceData = response.data.result;
            let result = approveInvoice(invoiceData, invoiceNo, req.body.status);
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        })

})

//disputeInvoice

app.post('/disputeInvoice', (req, res) => {
    let invoiceData = [];

    const invoiceNo = req.body.invoiceNo;
    axios.get('http://fb-invoice-reconciliation-api.mybluemix.net/invoices')
        .then((response) => {
            invoiceData = response.data.result;
            let result = disputeInvoice(invoiceData, invoiceNo, req.body.status);
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        })

})





function approveInvoice(invoiceData, invoiceNo, status) {

    for (let i = 0; i < invoiceData.length; i++) {

        if (invoiceData[i]['Record']['invoiceNo'] == invoiceNo) {
            invoiceData[i]['Record']['status'] = status;

            axios({
                method: 'post',
                url: 'http://fb-invoice-reconciliation-api.mybluemix.net/approveInvoice',
                data: invoiceData[i]['Record'],
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(response => {
                    // return response.data;
                    res.send(response);
                })
                .catch(function (error) {

                    return error;
                });
            break;
        }

    }

}


function disputeInvoice(invoiceData, invoiceNo, status) {

    for (let i = 0; i < invoiceData.length; i++) {

        if (invoiceData[i]['Record']['invoiceNo'] == invoiceNo) {
            invoiceData[i]['Record']['status'] = status;

            axios({
                method: 'post',
                url: 'http://fb-invoice-reconciliation-api.mybluemix.net/disputeInvoice',
                data: invoiceData[i]['Record'],
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(response => {
                    // return response.data;
                    res.send(response);
                })
                .catch(function (error) {

                    return error;
                });
            break;
        }

    }

}

app.listen(port, () => console.log(`Listening on port ${port}`));
