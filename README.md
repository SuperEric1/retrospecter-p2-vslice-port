# Vs. RetroSpecter - Part Two: Infernadise (Mobile Port)

Battle the 7 deadly sins, now on your phone.

This is a high quality **mobile port** of [Vs. RetroSpecter - Part Two: Infernadise](https://gamebanana.com/mods/317366) for V-Slice (base game FNF).

> **On PC?** Go play [the original mod](https://gamebanana.com/mods/317366) instead — this port is made for mobile devices.

## ⚠️ Content Warning

This mod contains a character resembling the sin of Lust, which may make some players uncomfortable. The port's options menu has a toggle to disable voice acting and poses for that character's final song.

## Download

Download it through the port's GameBanana page: https://gamebanana.com/mods/653579

## What this port HAS from the original

- Full weeks and songs from the main story
- Mechanics
- Custom menus
- Cutscenes
- Achievements
- Translations for different languages
- Custom options
- SOME extra songs

## What this port DOESN'T have from the original

- Side Stories
- Extra Songs
- Some custom menus
- Other small features

## Credits & Rights

This is a **fan port**, not an official release. I'm not associated with Team Respec, who owns the Infernadise universe and the original mod.

See [CREDITS.txt](CREDITS.txt) for the full breakdown of who owns what, and the terms for reusing this port's source code.

In-game credits list the original mod's team. The port's GameBanana page also lists everyone in the credits section.

## Contributing

Found a bug or want to suggest something? Check [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

Current development progress is tracked in [docs/TODO.md](docs/TODO.md).

## Preparing a mobile build copy

`prepare_mobile_build.py` prepares a **copy** of this source repository for a
mobile build. Run it from the copy's root with Python 3.9 or newer:

```sh
python prepare_mobile_build.py
```

The script asks for an explicit `YES` confirmation before changing anything. It
removes GitHub and development/editor configuration files, deletes every `.png`
that has an `.astc` file with the same name in the same folder, and clears the
`metadata` object in `polymod_meta.json` or `_polymod_meta.json`.

These changes are permanent. Do not run the script in your development clone or
in the repository you intend to contribute to.
