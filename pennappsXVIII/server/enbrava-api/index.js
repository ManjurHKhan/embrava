const express = require("express")
const app = express()
const docusign = require("docusign-esign");
const apiClient = new docusign.ApiClient();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
app.listen(3000, () => console.log("Listening on port 3000"));
app.get("/", (req, res) => res.send("Hello World!")); // TEST ONLY!
app.post("/agreement", (req, res) =>
    client.connect(url, function(err, db){
        if (err) throw err;
        console.log("Success!!");
        var dbo = db.db("endrava");
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

    envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envDef}, function (error, envelopeSummary, response) {
      if (error) {
        return done(error);
      }

      if (envelopeSummary) {
        console.log('EnvelopeSummary: ' + JSON.stringify(envelopeSummary));
        done();
      }
    });

        dbo.collection("users").insertOne(user, (err, mongoRes) => {
            if (err) throw err;
            console.log("Uploaded doc!");
            res.send("Endrrrava!");
        });
    })
);


