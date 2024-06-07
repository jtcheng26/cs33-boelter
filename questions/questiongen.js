const fs = require("fs");
const csv = require("csv-parser");

questions = [];

fs.createReadStream("questions.csv")
  .pipe(csv())
  .on("data", function (data) {
    try {
      console.log(data);
      if (data["Text response?"] === "No") {
        questions.push({
          file: `q${data["Question Number"]}.txt`,
          title: data["Title"],
          options: data["Answer option list or regex (case insensitive)"]
            .split("\n")
            .map((s) => s.substring(2).trim()),
          correct: Number.parseInt(
            data["If MCQ, which zero-indexed answer choice is correct?"]
          ),
          text: false,
          time: Number.parseInt(data["time (seconds)"]),
        });
      } else {
        questions.push({
          file: `q${data["Question Number"]}.txt`,
          title: data["Title"],
          correct: data["Answer option list or regex (case insensitive)"],
          text: true,
          time: Number.parseInt(data["time (seconds)"]),
        });
      }

      fs.writeFileSync(
        `questions/q${data["Question Number"]}.txt`,
        data["question text (may be multi lined)"]
      );

      //perform the operation
    } catch (err) {
      //error handler
    }
  })
  .on("end", function () {
    console.log(questions);
    fs.writeFileSync("questions.json", JSON.stringify(questions));
  });
