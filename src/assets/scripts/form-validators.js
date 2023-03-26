export const handleEmailValidation = (element) => {
  const isValid =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(element);

  return isValid;
};

export const handlePhoneValidation = (element) => {
  const isValid = /^[+]?[\s0-9]*[(]?[0-9]{1,4}[)]?[-\s0-9]*$/g.test(element);

  return isValid;
};

export const regexEmailValidation = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export const regexPhoneValidation = /^[+]?[\s0-9]*[(]?[0-9]{1,4}[)]?[-\s0-9]*$/g;

export const handleFileValidation = (type) => {
  switch (type) {
    case '.jpg':
    case '.png':
    case '.pdf':
    case '.doc':
    case '.docx':
    case '.txt':
      return true
      break;
    default:
      return false
  }
}
