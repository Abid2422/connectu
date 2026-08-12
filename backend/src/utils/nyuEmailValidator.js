const NYU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@nyu\.edu$/;

function isNyuEmail(email) {
  if (typeof email !== 'string') return false;
  return NYU_EMAIL_REGEX.test(email.trim().toLowerCase());
}

module.exports = { isNyuEmail };
