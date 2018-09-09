#!/usr/bin/nodejs

const docusign = require("docusign-esign");
const apiClient = new docusign.ApiClient();
var BaseUrl = 'https://demo.docusign.net/restapi';
apiClient.setBasePath(BaseUrl);
accessToken = "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwAATOtVNxbWSAgAAIwOZHoW1kgCAMxdo4SiMShNmf0SLQF_PrcVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4MAAAKO4XNxbWSA.OvpIJ6NjPnJGWbxvISiwDK05DeHzB9f1KlCGvbP4Qp4-ziJ-eqJ09ZxHjbvfDP4suhbrdIHVbTmN0p7A0ko3mX0kGzKZFQ4xdiKltvYZDAqV8qJPN31nVoZvHepvSlSvDnyCSTy5hZmn_D8Q4lDWObg2g8xyOK6R3igE4oiQSboAg8EU0M8tAtYTskP3aL0y6gxA6h_qYm-aGlHZfV-p2xUGJkKgg9Mk4XDJFkwfG1SNTU5Uu7ek0GqQNe2Mt6QapZE4XfdUyqAJ_aKv8jjVu4XzKrrdRB0fQHKoXkXk6vfTzih3eLAN3gHfeoEMtoPVvmARA8ishC9SwDDg5vfF2w";
apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
const DB_NAME = "endrava";
const MS_IN_MIN = 60000;
var client = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const ACCOUNT_ID = "6448450";
const BASE_RATE = 500;
function getDistractions() {
    client.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        let maxTime = new Date();
        let minTime = new Date(maxTime - MS_IN_MIN);
        var query = {
            "accountId": ACCOUNT_ID,
            "startTime": {
                "$gte": minTime
            },
            "endTime": {
                "$lte": maxTime
            }
        };
        return dbo.collection("distractions").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("\n\n\n");
            var numDistractions = result.length;
            var newRate = BASE_RATE - numDistractions * 3;
            var percentChange = newRate / 5;
            percentChange = (numDistractions > 5) ? "$" + percentChange : "-$" + percentChange;
            var res = {"numDistractions": numDistractions,
            "insuranceRate": "$" + newRate, 
            "maxTime": maxTime,
            "minTime": minTime,
            "changeInInsurance": percentChange};
            db.close();
            signDocument(res);
        });
    });
}


function signDocument(info) {
    // Call DocuSign, get document back.
    console.log(info);


    // create an envelope to be signed
    var envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Please Sign my Node SDK Envelope';
    envDef.emailBlurb = 'Hello, Please sign my Node SDK Envelope.';

    // / assign template information including ID and role(s)
    envDef.templateId = "961368b7-b66f-4fe8-ad46-9159f029528c";

    // create a template role with a valid templateId and roleName and assign signer info
    var tDriverRole = new docusign.TemplateRole();
    tDriverRole.roleName = "Driver";
    tDriverRole.name = "Miki";
    tDriverRole.email = "manjur.khan@stonybrook.edu";

    let employerEmail = "aaron.spitalny@stonybrook.edu";
    let insuranceEmail = "david.pokryvailo@stonybrook.edu";

    var tEmployerRole = new docusign.TemplateRole();
    tEmployerRole.roleName = "Employer";
    tEmployerRole.name = "Dunder Trucking Co.";
    tEmployerRole.email = employerEmail;

    var tInsuranceRole = new docusign.TemplateRole();
    tInsuranceRole.roleName = "Insurance";
    tInsuranceRole.name = "Geico Auto Insurance Group";
    tInsuranceRole.email = insuranceEmail;

    var tabs = {"textTabs": [ 
        {"tabLabel": "Month",
        "value": info.maxTime.toLocaleTimeString()
        },
        {"tabLabel": "Distractions",
        "value": info.numDistractions},
        {"tabLabel": "InsuranceRate",
        "value": info.insuranceRate},
        {"tabLabel": "ChangeInInsurance",
        "value": info.changeInInsurance}
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
        client.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(DB_NAME);
            var report = {"envelopeId": envelopeSummary.envelopeId,
            "accountId" : ACCOUNT_ID};
            dbo.collection("reports").insertOne(report, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
      }
    });
}

getDistractions();
