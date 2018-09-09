var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: false
    })
);

router.get("/", async function(req, res) {
    var configFile = req.app.get("appConfig");
    try {
        res.render("index-tmpl", {
            pageID: "form",
            title: "endrava"
        });
    } catch (err) {
        res.redirect("/");
    }
});

router.get("/reports", async function(req, res) {
    var configFile = req.app.get("appConfig");
    try {
        res.render("index-tmpl", {
            pageID: "reports",
            title: "endrava"
        });
    } catch (err) {
        res.redirect("/");
    }
});

router.get("/reports", async function(req, res) {
    var configFile = req.app.get("appConfig");
    
});


module.exports = router;
