import express from "express";

let app = express();
app.use(express.static("dist"));
let template = `
<html>
<head>
  <title>React Fiber</title>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
`;
app.get("*", (req, res) => {
  res.send(template);
});
app.listen(8888, () => {
  console.log("success");
});
