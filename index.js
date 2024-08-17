const readline = require('readline');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const exampleAliases = [
  { name: 'gp', command: 'git push', description: 'Push changes to remote git repository' },
  { name: 'gco', command: 'git checkout', description: 'Switch git branches or restore working tree files' },
  { name: 'll', command: 'ls -la', description: 'List directory contents in long format, including hidden files' },
  { name: 'myip', command: 'curl http://ipecho.net/plain; echo', description: 'Display public IP address' },
  { name: 'update', command: 'sudo apt-get update && sudo apt-get upgrade', description: 'Update and upgrade packages (Ubuntu/Debian)' }
];

const cyber = {
  prefix: '⚡ ',
  bullet: '➤ ',
  success: '✓ ',
  error: '✖ ',
  prompt: '❯ ',
  divider: '══════════════════════════════════════════════════',
  star: '★',
  circuit: '◎',
  key: '⚿',
  disk: '💾',
  terminal: '🖥️',
  rocket: '🚀'
};

function getShellConfigFile() {
  const shell = process.env.SHELL || '/bin/bash';
  const homeDir = os.homedir();
  return shell.includes('zsh') ? path.join(homeDir, '.zshrc') : path.join(homeDir, '.bashrc');
}

const configFile = getShellConfigFile();

function saveAlias(name, command) {
  const aliasString = `\nalias ${name}='${command}'\n`;
  fs.appendFileSync(configFile, aliasString);
  console.log(`${cyber.success} Alias '${name}' saved to ${configFile}`);
  console.log(`${cyber.bullet} Sourcing configuration...`);
  sourceConfig(configFile);
}

function sourceConfig(configFile) {
  exec(`source ${configFile}`, { shell: process.env.SHELL }, (error) => {
    if (error) {
      console.log(`${cyber.error} Error sourcing configuration: ${error.message}`);
      console.log(`${cyber.bullet} Please run 'source ${configFile}' manually to use the new alias.`);
    } else {
      console.log(`${cyber.success} Configuration sourced successfully. New alias is ready to use.`);
    }
  });
}

function loadExistingAliases() {
  const configContent = fs.readFileSync(configFile, 'utf8');
  const aliasRegex = /alias\s+(\w+)=['"](.+)['"]/g;
  const aliases = {};
  let match;
  while ((match = aliasRegex.exec(configContent)) !== null) {
    aliases[match[1]] = match[2];
  }
  return aliases;
}

function promptForInput(question) {
  return new Promise((resolve) => {
    rl.question(`${cyber.prompt} ${question}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function createNewAlias(name = null, command = null) {
  console.log(`${cyber.disk} Editing configuration file: ${configFile}`);
  if (!name) {
    console.log(cyber.divider);
    name = await promptForInput('Enter alias name:');
  }
  if (!command) {
    command = await promptForInput('Enter command:');
  }
  console.log(cyber.divider);
  console.log(`${cyber.circuit} Confirm new alias:`);
  console.log(`${cyber.key} Name: ${name}`);
  console.log(`${cyber.terminal} Command: ${command}`);
  const confirm = await promptForInput('Is this correct? (y/n):');
  
  if (confirm.toLowerCase() === 'y') {
    saveAlias(name, command);
  } else {
    console.log(`${cyber.error} Alias creation cancelled.`);
  }
}

async function useExampleAlias() {
  console.log(cyber.divider);
  console.log(`${cyber.star} Choose an example alias:`);
  exampleAliases.forEach((alias, index) => {
    console.log(`${cyber.bullet} ${index + 1}. ${alias.name}: ${alias.description}`);
  });
  console.log(cyber.divider);
  
  const choice = await promptForInput('Enter the number of your choice:');
  const index = parseInt(choice) - 1;
  
  if (index >= 0 && index < exampleAliases.length) {
    const alias = exampleAliases[index];
    console.log(`${cyber.circuit} Use this alias?`);
    console.log(`${cyber.key} Name: ${alias.name}`);
    console.log(`${cyber.terminal} Command: ${alias.command}`);
    const confirm = await promptForInput('Confirm? (y/n):');
    
    if (confirm.toLowerCase() === 'y') {
      saveAlias(alias.name, alias.command);
    } else {
      console.log(`${cyber.error} Alias creation cancelled.`);
    }
  } else {
    console.log(`${cyber.error} Invalid choice.`);
  }
}

async function modifyExistingAlias() {
  const aliases = loadExistingAliases();
  console.log(cyber.divider);
  console.log(`${cyber.disk} Existing aliases in ${configFile}:`);
  Object.entries(aliases).forEach(([name, command], index) => {
    console.log(`${cyber.bullet} ${index + 1}. ${name}: ${command}`);
  });
  console.log(cyber.divider);
  
  const choice = await promptForInput('Enter the number of the alias to modify:');
  const index = parseInt(choice) - 1;
  const aliasNames = Object.keys(aliases);
  
  if (index >= 0 && index < aliasNames.length) {
    const name = aliasNames[index];
    const newCommand = await promptForInput(`Enter new command for '${name}':`);
    console.log(`${cyber.circuit} Modify alias:`);
    console.log(`${cyber.key} Name: ${name}`);
    console.log(`${cyber.terminal} New Command: ${newCommand}`);
    const confirm = await promptForInput('Confirm? (y/n):');
    
    if (confirm.toLowerCase() === 'y') {
      saveAlias(name, newCommand);
    } else {
      console.log(`${cyber.error} Alias modification cancelled.`);
    }
  } else {
    console.log(`${cyber.error} Invalid choice.`);
  }
}

async function interactiveMode() {
  console.log(`\n${cyber.prefix} Welcome to the Cyberpunk Alias Wizard! ${cyber.prefix}`);
  console.log(`${cyber.disk} Editing configuration file: ${configFile}`);
  
  while (true) {
    console.log(cyber.divider);
    console.log(`${cyber.star} What would you like to do?`);
    console.log(`${cyber.bullet} 1. Create a new alias`);
    console.log(`${cyber.bullet} 2. Use an example alias`);
    console.log(`${cyber.bullet} 3. Modify an existing alias`);
    console.log(`${cyber.bullet} 4. Exit`);
    console.log(cyber.divider);
    
    const choice = await promptForInput('Enter your choice (1-4):');
    
    switch (choice) {
      case '1':
        await createNewAlias();
        break;
      case '2':
        await useExampleAlias();
        break;
      case '3':
        await modifyExistingAlias();
        break;
      case '4':
        console.log(`${cyber.rocket} Goodbye, netrunner! ${cyber.rocket}`);
        rl.close();
        return;
      default:
        console.log(`${cyber.error} Invalid choice. Please try again.`);
    }
  }
}

function printUsage() {
  console.log(`
${cyber.prefix} Cyberpunk Alias Wizard Usage ${cyber.prefix}

Interactive mode:
  node stylish-cyberpunk-alias-wizard.js

Create new alias:
  node stylish-cyberpunk-alias-wizard.js create <alias_name> <command>

Example:
  node stylish-cyberpunk-alias-wizard.js create gp "git push"
  `);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await interactiveMode();
  } else if (args[0] === 'create' && args.length === 3) {
    console.log(`${cyber.disk} Editing configuration file: ${configFile}`);
    await createNewAlias(args[1], args[2]);
    rl.close();
  } else {
    printUsage();
    process.exit(1);
  }
}

main();