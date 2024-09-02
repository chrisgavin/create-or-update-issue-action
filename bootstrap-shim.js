import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

const target = path.join(import.meta.dirname, "build", "index.js");
try {
	if (!fs.existsSync(target)) {
		console.warn("This is a development build! For greater reliability and faster startup time, please use a tagged release.");
		childProcess.execFileSync("npm", ["run", "bootstrap"], {stdio: "inherit", cwd: import.meta.dirname});
	}
	childProcess.execFileSync(process.execPath, [target], {stdio: "inherit"});
}
catch (error) {
	if (error.status === undefined) {
		throw error;
	}
	process.exitCode = error.status;
}
