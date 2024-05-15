module.exports = function(err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.send({
      result: "fail",
      error: { code: 1001, message: "La taille max est de 500ko" }
    });
    return;
  }
  if (err.message.includes("File type not supported")) {
    res.send({
      result: "fail",
      error: { message: "Fichier non supporté" }
    });
    return;
  }
};
