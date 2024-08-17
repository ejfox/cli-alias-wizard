# cli-alias-wizard

CLI tool for managing shell aliases.

https://github.com/user-attachments/assets/4678d331-18f1-4102-8116-905950fcb8e5


## Features

- Create new aliases
- Use example aliases
- Modify existing aliases
- Auto-source shell config
- Interactive and command-line modes

## Install

```
git clone https://github.com/yourusername/cli-alias-wizard.git
cd cli-alias-wizard
npm install
```

## Usage

Interactive mode:
```
node index.js
```

Command-line mode:
```
node index.js create <alias_name> "<command>"
npx cli-alias-wizard create <alias_name> "<command>"
```

Example:
```
node index.js create gp "git push"
npx cli-alias-wizard create g. "git add ."
```

## Config

Modifies ~/.bashrc or ~/.zshrc based on shell.

## Troubleshoot

If aliases don't work, run:
```
source ~/.bashrc
```
or
```
source ~/.zshrc
```

## License

MIT


