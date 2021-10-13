var fs = require("fs")

fs.readFile(
  "./node_modules/@polkadot/react-identicon/package.json",
  "utf8",
  function (err, data) {
    if (err) {
      return console.log(err)
    }
    var result = data.replace(/"type": "module",/g, "")

    fs.writeFile(
      "./node_modules/@polkadot/react-identicon/package.json",
      result,
      "utf8",
      function (err) {
        if (err) return console.log(err)
      },
    )
  },
)

fs.readFile(
  "./node_modules/@polkadot/ui-settings/Settings.js",
  "utf8",
  function (err, data) {
    if (err) {
      return console.log(err)
    }
    var result = data.replace("process.env.WS_URL ||", "")

    fs.writeFile(
      "./node_modules/@polkadot/ui-settings/Settings.js",
      result,
      "utf8",
      function (err) {
        if (err) return console.log(err)
      },
    )
  },
)
