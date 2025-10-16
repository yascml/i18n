# YASCML I18n

An i18n mod for [YASCML](https://github.com/yascml/yascml).

## Make Your Own I18n Mod

Pre-requests:

* A PC with [Node.JS](https://nodejs.org/) installed
* [`pnpm`](https://pnpm.io/) installed: `npm install -g pnpm`

1. Fork this repository and clone it
2. Install dependencies: `pnpm install`
3. Edit [`meta.json`](./meta.json):
    1. Edit `id` and `name`
    2. Edit `author` and `homepageURL`
    3. Add `designedFor` if you preferred
4. Build this mod: `pnpm run build`
5. Add your own `i18n.json` to `dist/<your_mod_id>.zip`
6. You're done! Now you can ublish `dist/<your_mod_id>.zip`

### How To Make `i18n.json`

Read [NumberSir/Sugarcube2-Localization](https://github.com/NumberSir/Sugarcube2-Localization#readme) for how-tos

## Thanks To

* [Lyoko-Jeremie/Degrees-of-Lewdity_Mod_i18nMod](https://github.com/Lyoko-Jeremie/Degrees-of-Lewdity_Mod_i18nMod)
* [NumberSir/Sugarcube2-Localization](https://github.com/NumberSir/Sugarcube2-Localization)
