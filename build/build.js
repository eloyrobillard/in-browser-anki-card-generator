import * as fs from 'fs';
import path from 'path';

function buildTarget(target) {
	const rootPath = path.resolve(process.cwd());
	const manifestVariantsPath = path.join(rootPath, 'manifest-variants');
	const manifestPath = path.join(manifestVariantsPath, `manifest-${target}.json`);

	const buildPath = path.join(rootPath, 'build', target);
	if (!fs.existsSync(buildPath)) {
		fs.mkdirSync(buildPath);
	}
			
	fs.copyFileSync(manifestPath, path.join(buildPath, 'manifest.json'));
	fs.copyFileSync(path.join(rootPath, 'browser-polyfill.js'), path.join(buildPath, 'browser-polyfill.js'));
	fs.copyFileSync(path.join(rootPath, 'popup.html'), path.join(buildPath, 'popup.html'));
	fs.copyFileSync(path.join(rootPath, 'LICENSE'), path.join(buildPath, 'LICENSE'));

	fs.cpSync(path.join(rootPath, 'js'), path.join(buildPath, 'js'), { recursive: true });
	fs.cpSync(path.join(rootPath, 'assets'), path.join(buildPath, 'assets'), { recursive: true });
}

const target = process.argv[2];

const targets = ['chrome', 'firefox'];

if (target && targets.includes(target)) {
	buildTarget(target);
} else {
	for (const target of targets) {
		buildTarget(target);
	}
}
