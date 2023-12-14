const { router } = require('../initial');
const fs = require('fs');

const uploadFile = async (base64, fileName) => {
    try {
        const path = __dirname + '/image/' + fileName;
        const fileBuffer = Buffer.from(base64, 'base64');
        fs.writeFileSync(path, fileBuffer)
        const fileUrl = 'http://localhost:5200/upload/' + fileName;
        return { status: 200, msg: fileUrl }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadFile,
}