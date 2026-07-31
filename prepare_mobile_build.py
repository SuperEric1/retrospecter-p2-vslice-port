"""Prepare a source-copy of this mod for a mobile build.

Run this script from the repository root. It permanently deletes development
files and PNGs that have a matching ASTC texture, so use it only on a copy.
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path


# These are development/version-control files at the repository root. Add a
# name here when a new editor configuration should not ship with mobile builds.
DIRECTORIES_TO_REMOVE = {
    #".git",
    ".github",
    ".vscode",
    ".idea",
    ".haxelib",
    "docs"
}
FILES_TO_REMOVE = {
    ".gitattributes",
    ".gitignore",
    ".gitmodules",
    ".gitkeep",
    "CONTRIBUTING.md",
    "README.md",
    "hxformat.json",
}
METADATA_FILES = ("polymod_meta.json", "_polymod_meta.json")


def remove_path(path: Path, removed: list[str]) -> None:
    """Remove a file or directory without following directory symlinks."""
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.is_dir():
        shutil.rmtree(path)
    else:
        return
    removed.append(str(path.relative_to(Path.cwd())))


def remove_development_files(root: Path, removed: list[str]) -> None:
    for name in sorted(DIRECTORIES_TO_REMOVE):
        path = root / name
        if path.exists() or path.is_symlink():
            remove_path(path, removed)

    for name in sorted(FILES_TO_REMOVE):
        path = root / name
        if path.exists() or path.is_symlink():
            remove_path(path, removed)


def remove_pngs_with_astc(root: Path, removed: list[str]) -> None:
    """Delete image.png only when image.astc exists in the same directory."""
    for astc_path in root.rglob("*.astc"):
        if not astc_path.is_file():
            continue

        png_path = astc_path.with_suffix(".png")
        if png_path.is_file():
            png_path.unlink()
            removed.append(str(png_path.relative_to(root)))


def clear_polymod_metadata(root: Path, changed: list[str]) -> None:
    for name in METADATA_FILES:
        metadata_path = root / name
        if not metadata_path.is_file():
            continue

        try:
            with metadata_path.open("r", encoding="utf-8") as file:
                contents = json.load(file)
        except (OSError, json.JSONDecodeError) as error:
            print(f"Warning: could not update {name}: {error}")
            continue

        if not isinstance(contents, dict):
            print(f"Warning: {name} does not contain a JSON object; skipping it.")
            continue

        if contents.get("metadata") != {}:
            contents["metadata"] = {}
            with metadata_path.open("w", encoding="utf-8", newline="\n") as file:
                json.dump(contents, file, ensure_ascii=False, indent=2)
                file.write("\n")
            changed.append(name)


def print_summary(removed: list[str], changed: list[str]) -> None:
    print("\nFinished preparing the mobile build copy.")
    print(f"Removed {len(removed)} file(s) or folder(s).")
    print(f"Updated {len(changed)} Polymod metadata file(s).")

    if removed:
        print("\nRemoved paths:")
        for path in removed:
            print(f"  - {path}")
    if changed:
        print("\nMetadata cleared in:")
        for path in changed:
            print(f"  - {path}")


def main() -> int:
    root = Path.cwd()
    print("WARNING: This script permanently deletes files and folders.")
    print("Run it ONLY inside a disposable copy of the mod source code.")
    print(f"Target folder: {root}")
    confirmation = input("Type YES to continue: ").strip()
    if confirmation != "YES":
        print("Cancelled. No files were changed.")
        return 0

    removed: list[str] = []
    changed: list[str] = []
    remove_development_files(root, removed)
    remove_pngs_with_astc(root, removed)
    clear_polymod_metadata(root, changed)
    print_summary(removed, changed)
    return 0


if __name__ == "__main__":
    sys.exit(main())
