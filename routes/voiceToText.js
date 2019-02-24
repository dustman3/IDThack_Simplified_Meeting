const express = require("express");
const router = express.Router();
const multer = require("multer");
let xss = require("xss");
let SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
let fs = require('fs');
const summarizer = require('nodejs-text-summarizer');
const dataLayer = require('../data/function.js');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.mimetype == 'audio/m4a' || file.mimetype == 'audio/mp4' || file.mimetype == 'audio/mpeg') {
      callback(null, './public/voice');
    } else {
      callback(null, false);
    }
  },
  filename: function (req, file, callback) {
    callback(null, (new Date().toISOString().replace(/:/g, '_') + file.originalname));
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype == 'audio/m4a' || file.mimetype == 'audio/mp4' || file.mimetype == 'audio/mpeg')
    callback(null, true);
  else
    callback(null, false);
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100024 * 100024 * 600
  },
  fileFilter: fileFilter
});




router.post("/", upload.single('file'), async (req, res) => {
  console.log("request has reached here!!")
  let voiceToText = null;
  let filetype = xss(req.file.mimetype);
  if (filetype == 'audio/mp4' || filetype == 'audio/m4a' || filetype == 'audio/mpeg') {
    try {
      // const title = xss(req.body.title);
      // const originalname = xss(req.file.originalname);
      // const mimetype = xss(req.file.mimetype);

      const filepath = req.file.path;
      let speech_to_text = new SpeechToTextV1({
        username: 'apikey',
        password: "cDS1pRoI1-RN-nh9mzCFc_AoktOszgIiaT4XhfslXjAU",
        // iam_apikey: 'cDS1pRoI1-RN-nh9mzCFc_AoktOszgIiaT4XhfslXjAU',
        url: 'https://stream.watsonplatform.net/speech-to-text/api'
      });
      let files = [filepath];
      for (var file in files) {
        let params = {
          audio: fs.createReadStream(files[file]),
          content_type: 'audio/mp3',
          timestamps: true,
          word_alternatives_threshold: 0.9,
          keywords: ['colorado', 'tornado', 'tornadoes'],
          keywords_threshold: 0.5
        };

        await speech_to_text.recognize(params, async function (error, transcript) {
          if (error)
            console.log('Error:', error);
          else {
            let convertedText = transcript.results[0].alternatives[0].transcript;

            voiceToText = async (convertedText) => {
              return convertedText;
            }
            // voiceToText = await transcript.results[0].alternatives[0].transcript;
            console.log("The converted text is : " + convertedText);
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Error : Unsupported file format!" });
    }
  } else {
    res.status(500).json({ error: "Error : Unsupported file format!" });
  }
  await res.status(200).json({ "text": voiceToText() });

});

router.post("/analysis", async (req, res) => {
  if (!req.body) throw "The request body is empty";
  let todoList = {};
  let eventList = {};
  let summary ={};
  let meetingText = req.body.text;
  let arrayText = meetingText.toLowerCase().split(" ");

  for (let i = 0; i < arrayText.length; i++) {
    if (arrayText[i] == "todo" || arrayText[i] == "to-do") {
      let j = i + 1;

      let temp = "";
      while (arrayText[j] != "done" && arrayText[j] + arrayText[j + 1] != "thatsit" && (j + 1) < arrayText.length) {
        if (arrayText[j] == "one" || arrayText[j] == "1") {
          temp = "";
          while (arrayText[j + 1] != "two" && arrayText[j + 1] != "2" && arrayText[j] != "done"
            && arrayText[j] + arrayText[j + 1] != "thatsit" && j < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["1"] = temp;
        }
        if (arrayText[j] == "two" || arrayText[j] == "2") {
          temp = "";
          while (arrayText[j + 1] != "three" && arrayText[j + 1] != "3" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["2"] = temp;
        }
        if (arrayText[j] == "three" || arrayText[j] == "3") {
          temp = "";
          while (arrayText[j + 1] != "four" && arrayText[j + 1] != "4" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["3"] = temp;
        }
        if (arrayText[j] == "four" || arrayText[j] == "4") {
          temp = "";
          while (arrayText[j + 1] != "five" && arrayText[j + 1] != "5" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["4"] = temp;
        }
        if (arrayText[j] == "five" || arrayText[j] == "5") {
          temp = "";
          while (arrayText[j + 1] != "six" && arrayText[j + 1] != "6" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["5"] = temp;
        }
        if (arrayText[j] == "six" || arrayText[j] == "6") {
          temp = "";
          console.log("data"+arrayText[j + 1] + arrayText[j + 2])
          while (arrayText[j + 1] != "seven" && arrayText[j + 1] != "7" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
              console.log("data"+arrayText[j + 1] + arrayText[j + 2])
              temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["6"] = temp;
        }
        if (arrayText[j] == "seven" || arrayText[j] == "7") {
          temp = "";
          while (arrayText[j + 1] != "seven" && arrayText[j + 1] != "7" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["7"] = temp;
        }
        if (arrayText[j] == "Eight" || arrayText[j] == "8") {
          temp = "";
          while (arrayText[j + 1] != "nine" && arrayText[j + 1] != "9" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["8"] = temp;
        }
        if (arrayText[j] == "nine" || arrayText[j] == "9") {
          temp = "";
          while (arrayText[j + 1] != "ten" && arrayText[j + 1] != "10" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["9"] = temp;
        }
        if (arrayText[j] == "ten" || arrayText[j] == "10") {
          temp = "";
          while (arrayText[j + 1] != "eleven" && arrayText[j + 1] != "11" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          todoList["10"] = temp;
        }
        if (arrayText[j + 1] == "done" || arrayText[j + 1] + arrayText[j + 2] == "thatsit") {
          break;
        }
        j++;
      }
      i = j;
    }
  }

  for (let i = 0; i < arrayText.length; i++) {
    if (arrayText[i] == "event" || arrayText[i] == "events" || arrayText[i] + arrayText[i+1]== "programmes") {
      let j = i + 1;

      let temp = "";
      while (arrayText[j] != "done" && arrayText[j] + arrayText[j + 1] != "thatsit" && (j + 1) < arrayText.length) {
        if (arrayText[j] == "one" || arrayText[j] == "1") {
          temp = "";
          while (arrayText[j + 1] != "two" && arrayText[j + 1] != "2" && arrayText[j] != "done"
            && arrayText[j] + arrayText[j + 1] != "thatsit" && j < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["1"] = temp;
        }
        if (arrayText[j] == "two" || arrayText[j] == "2") {
          temp = "";
          while (arrayText[j + 1] != "three" && arrayText[j + 1] != "3" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["2"] = temp;
        }
        if (arrayText[j] == "three" || arrayText[j] == "3") {
          temp = "";
          while (arrayText[j + 1] != "four" && arrayText[j + 1] != "4" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["3"] = temp;
        }
        if (arrayText[j] == "four" || arrayText[j] == "4") {
          temp = "";
          while (arrayText[j + 1] != "five" && arrayText[j + 1] != "5" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["4"] = temp;
        }
        if (arrayText[j] == "five" || arrayText[j] == "5") {
          temp = "";
          while (arrayText[j + 1] != "six" && arrayText[j + 1] != "6" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["5"] = temp;
        }
        if (arrayText[j] == "six" || arrayText[j] == "6") {
          temp = "";
          while (arrayText[j + 1] != "seven" && arrayText[j + 1] != "7" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["6"] = temp;
        }
        if (arrayText[j] == "seven" || arrayText[j] == "7") {
          temp = "";
          while (arrayText[j + 1] != "seven" && arrayText[j + 1] != "7" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["7"] = temp;
        }
        if (arrayText[j] == "Eight" || arrayText[j] == "8") {
          temp = "";
          while (arrayText[j + 1] != "nine" && arrayText[j + 1] != "9" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["8"] = temp;
        }
        if (arrayText[j] == "nine" || arrayText[j] == "9") {
          temp = "";
          while (arrayText[j + 1] != "ten" && arrayText[j + 1] != "10" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["9"] = temp;
        }
        if (arrayText[j] == "ten" || arrayText[j] == "10") {
          temp = "";
          while (arrayText[j + 1] != "eleven" && arrayText[j + 1] != "11" &&
            arrayText[j + 1] != "done" && arrayText[j + 1] + arrayText[j + 2] != "thatsit" && (j + 1) < arrayText.length) {
            temp = temp + arrayText[j + 1] + " ";
            j++;
          }
          eventList["10"] = temp;
        }
        if (arrayText[j + 1] == "done" || arrayText[j + 1] + arrayText[j + 2] == "thatsit") {
          break;
        }
        j++;
      }
      i = j;
    }
  }
let meetingSummary = summarizer(meetingText);
summary["todoList"] = todoList;
summary["eventList"] = eventList;
summary["summary"] = meetingSummary;
summary["text"] = meetingText;
summary["dateStamp"] = new Date();
try {
  dataLayer.addTextSummary(summary);
} catch (error) {
  console.log("Could not insert the summary")
}
  res.status(200).json({ summary });
});

router.post("/analysis/summary", async (req, res) => {
  if (!req.body) throw "The request body is empty";
  let text = req.body.text;
  let summary = summarizer(text);
  console.log("summary")
  res.status(200).json({ "summary": summary });
});

router.get("/", async(req,res) => {
  let summary = undefined;
 
  try {
    summary = await dataLayer.getAllTextSummary();
   
     console.log(summary);
} catch (error) {
  res.status(404).json({"error":error})
}
res.status(200).render("home",{text: summary, css: "openSummary.css"})

});

router.get("/:id", async(req,res) => {
  let summary = undefined;
  let id = req.params.id;
  if(!id) throw "id not provided";
  try {
     summary = await dataLayer.getTextSummary(id);
     summary = JSON.stringify(summary);
     console.log(summary);
} catch (error) {
  res.status(404).json({"error":error})
}
res.status(200).render("notes",{text: JSON.parse(summary), css: "openSummary.css"})

});

module.exports = router; 