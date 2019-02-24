const mongoCollection = require("./mongoCollections");
const summaryC = mongoCollection.voiceToText;
const  uuid = require("node-uuid");
var xss = require("xss")

let exportedMethods = {
async addTextSummary(summary) {
    const summaryCollection = await summaryC();
    let newSummary = {
        _id: uuid.v4(),
        rsummary: summary
    }
    console.log("Text summary", summary)
    const insertSummaryDB = await summaryCollection.insertOne(newSummary);
    if (insertSummaryDB.insertedCount === 0) throw "Could not add summary";
    //summary["id"] = newSummary._id;
    return summary;
},

async getAllTextSummary() {
    const summaryCollection = await summaryC();
    return await summaryCollection.find({}).toArray();
},

async getTextSummary(id) {
    if (!id) throw "No summary found";
    const summaryCollection = await summaryC();
    let summary = await summaryCollection.findOne({
        _id: id
    })
    if (summary === null || summary === undefined) throw "No summary found";
    return summary;
}

// async getFiles(_title){
//     if (!_title) throw "Please Input the title";
//     const RE =  await articleC();

    
//     //let searchR = await RE.find({rtitle : { $regex: _title, $options: 'i' }},{projection:["rtitle","rarticles","rimagename","rimagepath","rmimetype"]}).toArray()
   
//     let searchArticles = await RE.find({rarticles : { $regex: _title, $options: 'i' }},{projection:["rtitle","rarticles","rimagename","rimagepath","rmimetype"]}).toArray()
    
//     if(searchArticles ==null){
//         throw `No matches found`;
//     }

//     // console.log(recipesWanted);
//     // console.log(recipesWanted[0])
//     return searchArticles
// }
}


module.exports = exportedMethods;