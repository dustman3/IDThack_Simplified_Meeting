const voiceToText = require("./voiceToText");

const constructorMethod = (app) => {
    app.use("/text",voiceToText);
    app.get("/*", (req,res)=> {
        res.status(404).json({"error" : "error"});
    })
}

module.exports = constructorMethod;