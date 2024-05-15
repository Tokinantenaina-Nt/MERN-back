module.exports.signUpErr = err => {
  let errors = { username: "", email: "", password: "" };
  if (err.message.includes("username"))
    errors.username = "Pseudo incorrect ou déjà pris ";
  if (err.message.includes("email")) errors.email = "email incorrect ";
  if (err.message.includes("password"))
    errors.password = "mot de passe doit être 6 caractères au minimum";
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("username"))
    errors.username = "Pseudo déjà pris ";
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "email existe déjà ";
  return errors;
};
module.exports.signInErr = err => {
  let errors = { email: "", password: "" };
  if (err.message.includes("email")) errors.email = "email inconnue";
  if (err.message.includes("password"))
    errors.password = "mot de passe ne correspond pas";
  return errors;
};
