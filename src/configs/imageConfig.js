const fileFilter = (req, file, cb) => {
  const allowedExtensions = ["png", "jpeg", "jpg", "xlsx"];
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  if (allowedExtensions.includes(fileExtension)) cb(null, true);
  else cb(new Error("Invalid file format."), false);
};

const limits = {
  fileSize: 1 * 1024 * 1024, // 1MB
};

module.exports = {
  fileFilter,
  limits,
};
