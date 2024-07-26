<h1 align="center">ob-plugin-cli</h1>

`ob-plugin-cli` is a command line tool that can help you quickly initialize a Obsidian Plugin development environment.

## Usage

```shell
npm install -g ob-plugin-cli
ob-plugin-cli create xxx

# or

npx ob-plugin-cli create xxx

# then you can go to xxx folder and start work
# cd xxx
# npm run dev
```

## Other

this cli use `git clone` to get template from `github`, so maybe you need use `proxy`, try it:

```shell
ob-plugin-cli create xxx -p
```
