#!/usr/bin/env python3
"""Update a plant's "last watered" date on the portfolio site and push it live.

Edits assets/js/plants.js directly (each plant's `wateredOn: 'YYYY-MM-DD'`
field), then commits and pushes so the live site picks it up. Run with no
arguments to water all 5 plants with today's date.

Usage:
    ./water.py                    # all 5 plants, today
    ./water.py fig violet         # just these two, today
    ./water.py --all
    ./water.py fig --date 2026-09-10   # backdate
    ./water.py fig --no-push      # update + commit locally, skip the push
    ./water.py fig --no-commit    # just edit the file, don't touch git

Plant names (case-insensitive, any of these work):
    fig / fiddlefig / fiddle-fig
    violet / african-violet
    orchid
    kalanchoe / white-kalanchoe
    yellow / yellow-kalanchoe
"""
import argparse
import datetime
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
PLANTS_JS = ROOT / "assets" / "js" / "plants.js"

ALL_KEYS = ["yellowKalanchoe", "violet", "orchid", "kalanchoe", "fiddleFig"]

LABELS = {
    "yellowKalanchoe": "Yellow kalanchoe",
    "violet": "African violet",
    "orchid": "Orchid",
    "kalanchoe": "Kalanchoe",
    "fiddleFig": "Fiddle-leaf fig",
}

ALIASES = {
    "fig": "fiddleFig", "fiddlefig": "fiddleFig",
    "violet": "violet", "africanviolet": "violet",
    "orchid": "orchid",
    "kalanchoe": "kalanchoe", "whitekalanchoe": "kalanchoe",
    "yellow": "yellowKalanchoe", "yellowkalanchoe": "yellowKalanchoe",
}


def normalize(name):
    return re.sub(r"[^a-z0-9]", "", name.lower())


def resolve(name):
    key = ALIASES.get(normalize(name))
    if not key:
        sys.exit("Unknown plant '%s'. Options: %s" % (name, ", ".join(sorted(ALIASES))))
    return key


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("plants", nargs="*", help="which plants (default: all 5)")
    ap.add_argument("--all", action="store_true", help="water all 5 (same as no args)")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD (default: today)")
    ap.add_argument("--no-commit", action="store_true", help="edit the file but don't commit")
    ap.add_argument("--no-push", action="store_true", help="commit but don't push")
    args = ap.parse_args()

    keys = ALL_KEYS if (args.all or not args.plants) else [resolve(p) for p in args.plants]
    keys = list(dict.fromkeys(keys))  # de-dupe, keep first-mentioned order

    date = args.date or datetime.date.today().isoformat()
    try:
        datetime.date.fromisoformat(date)
    except ValueError:
        sys.exit("--date must be YYYY-MM-DD, got '%s'" % date)

    text = PLANTS_JS.read_text()
    updated = []
    for key in keys:
        # non-greedy up to the *first* wateredOn after this plant's own
        # opening brace, so this only ever touches that plant's own field
        # even though every plant object has the same field name
        pattern = re.compile(
            r"(\b" + re.escape(key) + r":\s*\{.*?wateredOn:\s*')\d{4}-\d{2}-\d{2}(')",
            re.DOTALL,
        )
        new_text, n = pattern.subn(lambda m: m.group(1) + date + m.group(2), text, count=1)
        if n == 0:
            print("warning: couldn't find '%s' in plants.js -- skipped" % key, file=sys.stderr)
            continue
        text = new_text
        updated.append(key)

    if not updated:
        sys.exit("Nothing updated.")

    PLANTS_JS.write_text(text)
    print("Updated %s -> %s" % (", ".join(LABELS[k] for k in updated), date))

    if args.no_commit:
        return

    subprocess.run(["git", "-C", str(ROOT), "add", "assets/js/plants.js"], check=True)
    if len(updated) == len(ALL_KEYS):
        msg = "Water all plants"
    else:
        msg = "Water " + ", ".join(LABELS[k] for k in updated)
    result = subprocess.run(["git", "-C", str(ROOT), "commit", "-m", msg])
    if result.returncode != 0:
        sys.exit("git commit failed (maybe nothing changed?) -- see output above")
    print("Committed: %s" % msg)

    if args.no_push:
        return
    subprocess.run(["git", "-C", str(ROOT), "push"], check=True)
    print("Pushed -- live in a minute or two.")


if __name__ == "__main__":
    main()
