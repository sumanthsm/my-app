const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const json2csv = require('json2csv').parse;
var csvjson = require('csvjson');
var fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function convertToJson(){
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

app.get('/api/invoice:id', (req, res) => {
    let result = [];
    let csvData = convertToJson();
    for (let i = 0; i < csvData.length; i++) {
        if (csvData[i].id === req.params.id) {
            result.push(csvData[i]);
        }
    }
    res.json(result);
});

app.get('/api/filterbystatus:status', (req, res) => {
    let result = [];
    let csvData = convertToJson();
    for (let i = 0; i < csvData.length; i++) {
        if (csvData[i]['Status'] === req.params.status) {
            result.push(csvData[i]);
        }
    }
    res.json(result);
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
    res.json({'status': 'success'});
});

app.post('/api/createinvoice', (req, res) => {
    const fields = ['id', 'Invoice_Date', 'Invoice_name', 'Line_of_business', 'Price', 'Quantity', 'Status'];
    const opts = { fields };
    let flag = 0;
    let jsonData = convertToJson();
    const newInvoiceData = req.body.data;
    for(let i=0;i<jsonData.length;i++){
        if(jsonData[i]['id'] === newInvoiceData['id']){
            flag = 1;
            break;
        }
    }

    if(flag === 0){
        console.log("flag true");
        
        jsonData.push(newInvoiceData);
        fs.writeFile("./assets/mock-data.csv", json2csv(jsonData, opts), function (err) {
            if (err) {
                throw err;
            }
        });
        res.json({'status': 'success'});
    }else{
        console.log("flag false");
        res.json({'status': 'fail'});
    }
});


app.listen(port, () => console.log(`Listening on port ${port}`));