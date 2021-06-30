const fs = require("fs");
const path = require("path");

const targetPath = `./${process.argv[0]}`;

const makeDir = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.promises.mkdir(folder).catch(console.log);
  }
};

const makeDirs = () => {
  const folders = [
    path.join(targetPath, "video"),
    path.join(targetPath, "captured"),
    path.join(targetPath, "duplicated"),
  ];
	for (let folder of folders) {
		makeDir(folder);
	}
};

const moveFile = (targetPath, movePath, file) => {
  const origin = path.join(targetPath, file);
  const rename = path.join(targetPath, movePath, file);
  fs.promises.rename(origin, rename).catch(console.log);
};

const separateFile = (fileList) => {
  console.log(fileList);
  for (let file of fileList) {
    if (file === ".DS_Store") continue;
    let extName = path.extname(file);
    if (extName === ".png" || extName === ".aae") {
      moveFile(targetPath, "captured", file);
    } else if (extName === ".jpg") {
      if (path.basename(file).split("_")[1][0] !== "E") {
        moveFile(targetPath, "duplicated", file);
      }
    } else if (extName === '') {
			continue;
		} else {
      moveFile(targetPath, "video", file);
    }
  }
};

makeDirs();
fs.promises.readdir(targetPath)//
	.then(separateFile)//
	.catch(console.error);
