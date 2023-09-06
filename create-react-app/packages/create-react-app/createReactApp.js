const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const packageJson = require('./package.json');
let appName;
async function init() {
  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((projectDirectory) => {
      appName = projectDirectory;
    })
    .parse(process.argv);
  await createApp(appName);
}
async function createApp(appName) {
  const root = path.resolve(appName);
  fs.ensureDirSync(appName);
  console.log(`Creating a new React app in ${chalk.green(root)}.`);
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  };
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  const originalDirectory = process.cwd();
  process.chdir(root);
  await run(root, appName, originalDirectory);
}
async function run(root, appName, originalDirectory) {
  const scriptName = 'react-scripts';
  const templateName = 'cra-template';
  const allDependencies = ['react', 'react-dom', scriptName, templateName];
  console.log('Installing packages. This might take a couple of minutes.');
  console.log(
    `Installing ${chalk.cyan('react')}, ${chalk.cyan(
      'react-dom'
    )}, and ${chalk.cyan(scriptName)} with ${chalk.cyan(templateName)}`
  );
  await install(root, allDependencies);
  let data = [root, appName, true, originalDirectory, templateName];
  let source = `
      var init = require('react-scripts/scripts/init.js');
      init.apply(null, JSON.parse(process.argv[1]));
    `;
  await executeNodeScript({ cwd: process.cwd() }, data, source);
  console.log('Done.');
  process.exit(0);
}
function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['-e', source, '--', JSON.stringify(data)],
      { cwd, stdio: 'inherit' }
    );
    child.on('close', resolve);
  });
}
function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = 'yarnpkg';
    const args = ['add', '--exact', ...allDependencies, '--cwd', root];
    console.log('command:', command, args);
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', resolve);
  });
}
module.exports = {
  init,
};
