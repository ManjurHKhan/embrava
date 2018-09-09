const express = require("express")
const app = express()
const docusign = require("docusign-esign");
const bodyParser = require("body-parser");
const DB_NAME = "endrava";
const ACCOUNT_ID = "6448450";
app.use(bodyParser.json());
var apiClient = new docusign.ApiClient();
var BaseUrl = 'https://demo.docusign.net/restapi';
apiClient.setBasePath(BaseUrl);
accessToken ="eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwCALDQPDBbWSAgAgGxXHU8W1kgCAMxdo4SiMShNmf0SLQF_PrcVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4MAAAQUtaBhbWSA.ytBD9tIMjmIqm3R1wZi75r2IRoLcHuvharf5_2DxjTcYNLkK4KDky3xagfYUB0Qno13leVXfZm-ga3ZepJwBRetIJvGcqT9svFHP5b6ukU0ZbbpZQmQOT_L3LiybRFtjTzZmR4Zj1a1dBKkmr1nBLT7SVljwElTrMHOuoiz4BBnRVVZv3mWCsiWU7xvLnrgqX363WLG6dbNUycgp_39J0_HKHDtOgwzRih6wQ-cF-grqsavMj8MplL8oxRiIFtS5j1lekw_boWs0KMqq40TYTQux0HWZzvXMV93Mjy8m5JdvfNsM3h0kvLAx1PRwsevsHt7HbpOx8w-uVlFdobuLTg";
apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
app.listen(3000, () => console.log("Listening on port 3000"));
app.get("/", (req, res) => res.send("Hello World!")); // TEST ONLY!
app.post("/agreement", (req, res) =>
    client.connect(url, function(err, db){
        if (err) throw err;
        console.log("Success!!");
        var dbo = db.db(DB_NAME);
        req = req.body;
        const name = req.name;
        const insurance = req.insuranceCompany;
        const employer = req.employer;
        const email = req.email;
        // Call DocuSign, get document back.
        const user = {
            "name": name,
            "insuranceCompany": insurance,
            "employer": employer,
            "email": email
        }
        console.log(user);


    // create an envelope to be signed
    var envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Please Sign my Node SDK Envelope';
    envDef.emailBlurb = 'Hello, Please sign my Node SDK Envelope.';

    // / assign template information including ID and role(s)
    envDef.templateId = "e85f7996-c5f4-4e49-8cdc-0fc79a301bbb";

    // create a template role with a valid templateId and roleName and assign signer info
    var tDriverRole = new docusign.TemplateRole();
    tDriverRole.roleName = "Driver";
    tDriverRole.name = name;
    tDriverRole.email = email;

    let employerEmail = "aaron.spitalny@stonybrook.edu";
    let insuranceEmail = "david.pokryvailo@stonybrook.edu";

    var tEmployerRole = new docusign.TemplateRole();
    tEmployerRole.roleName = "Employer";
    tEmployerRole.name = employer;
    tEmployerRole.email = employerEmail;

    var tInsuranceRole = new docusign.TemplateRole();
    tInsuranceRole.roleName = "Insurance";
    tInsuranceRole.name = insurance;
    tInsuranceRole.email = insuranceEmail;

    var tabs = {"textTabs": [ 
        {"tabLabel": "Employer",
        "value": tEmployerRole.name
        },
        {"tabLabel": "InsuranceCompany",
        "value": tInsuranceRole.name},
        {"tabLabel": "InsuranceRate",
        "value": "$4000"}
    ]}
    console.log(tabs);
    tDriverRole.tabs = tabs;


    // create a list of template roles and add our newly created role
    var templateRolesList = [];
    templateRolesList.push(tDriverRole);
    templateRolesList.push(tEmployerRole);
    templateRolesList.push(tInsuranceRole);

    // assign template role(s) to the envelope
    envDef.templateRoles = templateRolesList;

    // send the envelope by setting |status| to "sent". To save as a draft set to "created"
    envDef.status = 'sent';

    var envelopesApi = new docusign.EnvelopesApi(apiClient);
    let accountId = "c77125a6-7d56-4017-bb5c-b1ed9a8819f6";
    console.log("-------------------------------------------------");
    console.log(envDef);
    envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envDef}, function (error, envelopeSummary, response) {
      if (error) {
        console.log(error)
        return done(error);
      }

      if (envelopeSummary) {
        console.log('EnvelopeSummary: ' + JSON.stringify(envelopeSummary));
        console.log("SUCESSSSSSS!");
      }
    });

        dbo.collection("users").insertOne(user, (err, mongoRes) => {
            if (err) throw err;
            console.log("Uploaded doc!");
            res.send("Endrrrava!");
        });
    })
);


app.post('/distraction', function(req, res) {
    client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        var myobj = req.body;
        dbo.collection("distractions").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.send('done');
});

app.get("/envelopes", function(req, res) {
    client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        var query = {"accountId": ACCOUNT_ID};
        dbo.collection("reports").find(query).toArray(function(err, data) {
            if (err) throw err;
            db.close();
            res.send(data);
        });
    });
});
