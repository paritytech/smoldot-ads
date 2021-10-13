var fs = require("fs")

fs.readFile("./dist/bundle.js", "utf8", function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace("process.env.WS_URL ||", "")

  fs.writeFile("./dist/bundle.js", result, "utf8", function (err) {
    if (err) return console.log(err)
  })
})
