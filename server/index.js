const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const port = 5000;

app.use(express.urlencoded({ extended: false }));

app.get("/cardPacks/:pack?", (req, res) => {
  if(req.params.pack) {
    const exists = fs.existsSync(path.resolve(__dirname, "cardPacks", req.params.pack))

    if(exists) {
      const white = fs.readFileSync(path.resolve(__dirname, "cardPacks", req.params.pack, "white.json"), "utf-8")
      const black = fs.readFileSync(path.resolve(__dirname, "cardPacks", req.params.pack, "black.json"), "utf-8")
  
      res.json({
        white: JSON.parse(white),
        black: JSON.parse(black),
      })
    } else {
      res.json({
        error: `Card pack with name "${req.params.pack}" does not exist. See ${req.protocol}://${req.get('host')}/cardPacks for a list of card packs.`
      })
    }
  } else {
    const items = fs.readdirSync(path.resolve(__dirname, "cardPacks"))

    let packs = [];

    items.forEach(i => {
      packs.push({
        name: i,
        cards: `${req.protocol}://${req.get('host')}${req.originalUrl}/${i}`
      })
    })

    res.json({
      packs
    })
  }
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});
