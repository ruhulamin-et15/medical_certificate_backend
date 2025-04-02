import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    const newFilename = `${timestamp}-${baseName}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

// Upload single images
const profileImage = upload.single("profileImage");
const fileUpload = upload.single("fileUpload");

// Upload multiple images for portfolio
const sendFiles = upload.fields([
  { name: "sendFiles", maxCount: 10 },
  { name: "complaintFiles", maxCount: 4 },
  { name: "messageFiles", maxCount: 10 },
]);

export const fileUploader = {
  sendFiles,
  profileImage,
  fileUpload,
};
