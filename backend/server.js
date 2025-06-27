const httpServer = require("./index");
const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
