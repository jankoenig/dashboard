const fs = require("fs");
const path = require("path");

const files = ["package.json", "bower.json"];

function write(file, data) {
    fs.writeFile(path.normalize(file), data, (err) => { // eslint-disable-line security/detect-non-literal-fs-filename
        if (err) {
            console.error(err); // eslint-disable-line no-console
            return;
        }
    });
}

for (let f of files) {
    fs.readFile(path.normalize(f), {encoding: "utf8"}, (err, data) => { // eslint-disable-line security/detect-non-literal-fs-filename
        if (err) {
            console.error(err); // eslint-disable-line no-console
            return;
        }
        const fJSON = JSON.parse(data);
        fJSON.version = process.env.BUILD_VERSION;
        write(f, JSON.stringify(fJSON, null, 2));
    });
}
