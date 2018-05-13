# spacex-bitbar-plugin

SpaceX plugin for [BitBar](https://github.com/matryer/bitbar)

Polls https://api.spacexdata.com/v2/launches/upcoming for upcoming SpaceX launches and displays them as a top menu bar dropdown.

## Download Plugin

```bash
git clone git@github.com:tdlm/spacex-bitbar-plugin.git
cd spacex-bitbar-plugin
```

## Install Plugin

First, we must install the dependencies.

```bash
npm install
```

Next, we install our symlink.

```bash
# <plugins> is the BitBar plugins directory path.
ln -sf spacebar.30s.js <plugins>/spacebar.30s.js
```

## Uninstall Plugin

```bash
# <plugins> is the BitBar plugins directory path.
rm <plugins>/spacebar.30s.js
```

## License

[MIT](LICENSE)
