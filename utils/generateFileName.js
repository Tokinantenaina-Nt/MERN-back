fileNamePath = "";
const generateFileName = (req, folder) => {
  //  => {
  if (!fileNamePath && folder === "profil") {
    if (req) fileNamePath = req.body.name + ".jpg";
    else fileNamePath = "noreqprofil.jpg";
  }
  if (!fileNamePath && folder === "posts") {
    if (req) {
      console.log(req.body.posterId);
      fileNamePath = req.body.posterId + Date.now() + ".jpg";
    } else fileNamePath = "noreqpost.jpg";
  }
  return fileNamePath;
  // };
};
module.exports = { generateFileName };
