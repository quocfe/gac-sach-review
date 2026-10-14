"""Rebuild checked-in WOFF2s: uv run --with fonttools --with brotli python scripts/bundle-fonts.py.

Not part of installation/build: production never contacts a font provider.
Verify upstream Git blob IDs before subsetting; retain Vietnamese NFC/NFD.
"""
from hashlib import sha1
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1] / "src/app/fonts"
SOURCES = [
    ("sourcesans3/SourceSans3%5Bwght%5D.ttf", "d259aa494fe7117141a2752a998a52c172bbd42b", "source-sans-3"),
    ("sourceserif4/SourceSerif4%5Bopsz%2Cwght%5D.ttf", "40bbb58cb58e893ad0470f0bb291e096c73d3554", "source-serif-4"),
    ("sourceserif4/SourceSerif4-Italic%5Bopsz%2Cwght%5D.ttf", "ccb969aa6847e1169ff9c8c8bdc28daff6966861", "source-serif-4-italic"),
]
# Latin + Vietnamese + all combining marks, punctuation, currency and arrows.
RANGES = [(0, 0x024F), (0x0300, 0x036F), (0x1E00, 0x1EFF),
          (0x2000, 0x206F), (0x20A0, 0x20CF), (0x2190, 0x21FF)]
ROOT.mkdir(parents=True, exist_ok=True)
for source, expected_blob, name in SOURCES:
    with urlopen(f"https://raw.githubusercontent.com/google/fonts/main/ofl/{source}") as response:
        data = response.read()
    actual_blob = sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
    if actual_blob != expected_blob:
        raise ValueError(f"Upstream changed: {name}: {actual_blob}; review before updating")
    font = TTFont(BytesIO(data))
    options = subset.Options()
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[c for start, end in RANGES for c in range(start, end + 1)])
    subsetter.subset(font)
    font.flavor = "woff2"
    output = ROOT / f"{name}.woff2"
    font.save(output)
    print(f"{output.name}: {output.stat().st_size} bytes")
