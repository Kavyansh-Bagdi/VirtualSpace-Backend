const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function genPassword(password: string): string {
  try {
    return bcrypt.hashSync(password, 10);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function verifyPassword(hashPassword: string, password: string): boolean {
  return bcrypt.compareSync(password, hashPassword);
}

function genToken(name: string, email: string): string {
  return jwt.sign({ name, email }, process.env.PRIVATE_KEY,{ expiresIn: "24h" });
}

function verifytoken(token: string): boolean {
  try {
    jwt.verify(token, process.env.PRIVATE_KEY as string);
    return true;
  } catch (err) {
    return false;
  }
}

export { genPassword, verifyPassword, genToken, verifytoken };
