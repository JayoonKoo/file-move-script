const path = require('path');
const os = require('os');
const fs = require('fs');

const folder = process.argv[2];
const workingDir = path.join(os.homedir(), "Pictures", folder);

// 1.사용자가 원하는 폴더의 이름을 받아온다. 
if (!folder || !fs.existsSync(workingDir)) {
	console.log("적용하고 싶은 폴더를 ~/Pitcures 안에 넣으세요");
	return;
}

// 2.핵심 로직
const videoDir = path.join(workingDir, "video");
const capturedDir = path.join(workingDir, "captured");
const duplicatedDir = path.join(workingDir, "duplicated");

!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

fs.promises.readdir(workingDir) //
	.then(processFiles)//
	.catch(console.log);

function processFiles(files) {
	files.forEach(file => {
		if (isVideoFile(file)) {
			moveFile(file, videoDir);
		} else if (isCapturedFile(file)) {
			moveFile(file, capturedDir);
		} else if (isDuplicatedFile(files, file)) {
			moveFile(file, duplicatedDir);
		}
	})
}

function moveFile(file, targetDir) {
	const oldPath = path.join(workingDir, file);
	const newPath = path.join(targetDir, file);
	fs.promises.rename(oldPath, newPath)//
		.catch(console.log);
}

function isVideoFile(file) {
	const regrex = /(mov|mp4)$/gm;
	const match = file.match(regrex);
	return !!match;
}
function isCapturedFile(file) {
	const regrex = /(png|aae)$/gm;
	const match = file.match(regrex);
	return !!match;
}
function isDuplicatedFile(files, file) {
	if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
		return false;
	}

	edited = `IMG_E${file.split('_')[1]}`;
	const found = files.find(f => f.includes(edited));
	return !!found;
}