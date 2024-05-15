const multer = require("multer");
const path = require("path");
const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
let fileNamePathPost = "";
let fileNamePathProfil = "";
const fileName = req => {
  if (!fileNamePathPost || !fileNamePathProfil) {
    fileNamePathPost = req.body.posterId + Date.now() + ".jpg";
    fileNamePathProfil = req.body.name + ".jpg";
    return { fileNamePathPost, fileNamePathProfil };
  } else {
    setTimeout(() => {
      fileNamePathPost = "";
      fileNamePathProfil = "";
    }, 1000);
  }
  return { fileNamePathPost, fileNamePathProfil };
};

function storagePath(folder) {
  if (folder === "posts") {
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        const uploadPath = path.join(
          __dirname,
          `../client/public/uploads/${folder}/`
        );
        cb(null, uploadPath);
      },
      filename: function(req, file, cb) {
        cb(null, fileName(req).fileNamePathPost);
      }
    });
    return storage;
  }
  if (folder === "profil") {
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        const uploadPath = path.join(
          __dirname,
          `../client/public/uploads/${folder}/`
        );
        cb(null, uploadPath);
      },
      filename: function(req, file, cb) {
        cb(null, fileName(req).fileNamePathProfil);
      }
    });
    return storage;
  }
}

const uploadUser = multer({
  storage: storagePath("profil"),
  limits: {
    fileSize: 512000
  },
  fileFilter: function(req, file, cb) {
    try {
      if (!allowedMimeTypes.includes(file.mimetype))
        throw Error("File type not supported");
      cb(null, true);
    } catch (err) {
      cb(err);
    }
  }
});

const uploadPost = multer({
  storage: storagePath("posts"),
  limits: {
    fileSize: 512000
  },
  fileFilter: function(req, file, cb) {
    try {
      if (!allowedMimeTypes.includes(file.mimetype))
        throw Error("File type not supported");
      cb(null, true);
    } catch (err) {
      cb(err);
    }
  }
});

module.exports = { uploadUser, uploadPost, fileName };
