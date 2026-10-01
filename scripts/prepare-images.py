"""
Prepares all static image assets for the Moss Landscaping demo.

  python3 scripts/prepare-images.py

Inputs:  resources/*.PNG (supplied concept renders + mockup)
Outputs: public/images/*.jpg, public/og-moss-landscaping.jpg, app/icon.png,
         app/apple-icon.png, app/favicon.ico

Source JPEGs are written at high quality; next/image serves AVIF/WebP
variants at runtime, so these files are only the master copies.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "resources"
OUT = ROOT / "public" / "images"
FONTS = Path(__file__).resolve().parent / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = (11, 20, 28)
FOREST = (20, 42, 30)
ORANGE = (238, 123, 44)
IVORY = (247, 243, 236)

SOURCES = {
    "poolside-terrace-dusk": "C3B18802-E713-4545-BBBE-22C19185B352.PNG",
    "outdoor-kitchen-dining": "4E479DA8-C938-4F52-9AAE-DAEE136C03F3.PNG",
    "fire-lounge-terrace": "6ECB383E-1259-4195-840A-D723F86BD3E6.PNG",
    "sunset-pool-fire-lounge": "88FCD6D5-FE77-48E6-928B-F0C078323F85.PNG",
    "front-entry-walkway": "B9E0498D-E5AA-4C5D-A3BD-89FA6DF49819.PNG",
    "firepit-pavilion-garden": "E1B27A4E-6472-4151-9C35-717F96586168.PNG",
    "lit-steps-pavilion": "E4ED5978-8692-43D9-A67D-ED23DC4A91DF.PNG",
    "sunset-pool-waterfall": "0B443F2D-F343-40D0-8B8E-2CED5680DA69.PNG",
}

# (name, source key, box=(left, top, right, bottom))
CROPS = [
    ("detail-outdoor-kitchen", "outdoor-kitchen-dining", (880, 120, 1672, 720)),
    ("detail-pool-waterfall", "outdoor-kitchen-dining", (0, 330, 760, 760)),
    ("detail-round-firepit", "firepit-pavilion-garden", (360, 400, 1300, 941)),
    ("detail-fire-table-lounge", "fire-lounge-terrace", (560, 380, 1672, 941)),
    ("detail-seat-wall-planting", "front-entry-walkway", (0, 380, 1000, 941)),
    ("detail-lit-stone-steps", "lit-steps-pavilion", (240, 440, 1120, 941)),
    ("detail-natural-stone-falls", "sunset-pool-waterfall", (0, 300, 920, 860)),
    ("detail-pavilion-dining", "lit-steps-pavilion", (860, 160, 1672, 660)),
    ("detail-garden-grounds", "lit-steps-pavilion", (980, 420, 1672, 941)),
    ("detail-pool-cabana", "poolside-terrace-dusk", (560, 160, 1671, 760)),
    ("detail-sunken-firepit", "fire-lounge-terrace", (0, 440, 900, 941)),
    ("detail-entry-steps", "front-entry-walkway", (760, 0, 1672, 640)),
]

SKETCHES = ["lit-steps-pavilion", "front-entry-walkway", "fire-lounge-terrace"]


def font(name, size, weight):
    f = ImageFont.truetype(str(FONTS / name), size)
    f.set_variation_by_name(weight)
    return f


def save_jpg(img, path, quality=86):
    img.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def sketch(img):
    """Pencil/ink 'design concept' rendering of a finished scene."""
    gray = ImageOps.grayscale(img)
    gray = ImageEnhance.Brightness(gray).enhance(1.9)
    gray = ImageOps.autocontrast(gray, cutoff=1)
    g = np.asarray(gray).astype(np.float32)
    inv = 255 - g
    blur = np.asarray(Image.fromarray(inv.astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(np.float32)
    dodge = np.clip(g * 255.0 / np.maximum(255.0 - blur, 1), 0, 255)
    edges = np.asarray(gray.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)
    lines = np.clip(dodge - edges * 0.9, 0, 255)
    # soften toward paper tone and compress shadows so it reads as a drawing
    lines = 255 - (255 - lines) * 0.82
    paper = np.array([244, 239, 228], dtype=np.float32)
    out = (lines[..., None] / 255.0) * paper
    # faint blueprint-blue wash in darker areas
    wash = np.array([60, 84, 104], dtype=np.float32)
    t = ((255 - lines) / 255.0)[..., None] * 0.35
    out = out * (1 - t) + wash * t
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def wordmark(draw, x, y, scale=1.0):
    """Approximation of the Moss Landscaping wordmark: MOSS over an orange LANDSCAPING bar."""
    f_moss = font("PlayfairDisplay.ttf", int(84 * scale), "Black")
    f_sub = font("Manrope.ttf", int(17 * scale), "Bold")
    draw.text((x, y), "MOSS", font=f_moss, fill=ORANGE)
    mw = draw.textlength("MOSS", font=f_moss)
    bar_top = y + int(98 * scale)
    bar_h = int(30 * scale)
    draw.rectangle([x, bar_top, x + mw, bar_top + bar_h], fill=ORANGE)
    label = "LANDSCAPING"
    spacing = 9 * scale
    widths = [draw.textlength(c, font=f_sub) for c in label]
    total = sum(widths) + spacing * (len(label) - 1)
    cx = x + (mw - total) / 2
    for c, w in zip(label, widths):
        draw.text((cx, bar_top + bar_h / 2), c, font=f_sub, fill=(255, 255, 255), anchor="lm")
        cx += w + spacing
    return mw, bar_top + bar_h


def og_image():
    W, H = 1200, 630
    src = Image.open(RES / SOURCES["sunset-pool-fire-lounge"]).convert("RGB")
    bg = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.62, 0.55))
    # left-weighted navy/forest overlay so type stays legible at thumbnail sizes
    grad = Image.new("RGBA", (W, H))
    gp = grad.load()
    for xx in range(W):
        a = max(0.0, 1 - xx / (W * 0.78))
        alpha = int(255 * (0.18 + 0.74 * a ** 1.25))
        r = int(NAVY[0] * (1 - a) + FOREST[0] * a * 0.6 + NAVY[0] * a * 0.4)
        g = int(NAVY[1] * (1 - a) + FOREST[1] * a * 0.6 + NAVY[1] * a * 0.4)
        b = int(NAVY[2] * (1 - a) + FOREST[2] * a * 0.6 + NAVY[2] * a * 0.4)
        for yy in range(H):
            gp[xx, yy] = (r, g, b, alpha)
    img = Image.alpha_composite(bg.convert("RGBA"), grad)
    # bottom vignette
    vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vig)
    for i in range(160):
        vd.line([(0, H - i), (W, H - i)], fill=(*NAVY, int(150 * (1 - i / 160))))
    img = Image.alpha_composite(img, vig)
    d = ImageDraw.Draw(img)

    X = 72
    wordmark(d, X, 64, 0.8)
    d.rectangle([X, 244, X + 56, 248], fill=ORANGE)
    f_h1 = font("PlayfairDisplay.ttf", 66, "Bold")
    d.text((X, 276), "Extraordinary", font=f_h1, fill=(255, 255, 255))
    d.text((X, 350), "Outdoor Living", font=f_h1, fill=ORANGE)
    f_sub = font("Manrope.ttf", 25, "SemiBold")
    d.text((X, 462), "Landscape Design  •  Hardscapes  •  Outdoor Living", font=f_sub, fill=(236, 231, 222))
    f_small = font("Manrope.ttf", 21, "Medium")
    d.text((X, 540), "Residential & Commercial  ·  New Jersey", font=f_small, fill=(190, 198, 192))
    out = ROOT / "public" / "og-moss-landscaping.jpg"
    save_jpg(img, out, quality=84)
    print("og", out, out.stat().st_size // 1024, "KB")


def icons():
    def make(size):
        im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        r = int(size * 0.22)
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=NAVY)
        f = font("PlayfairDisplay.ttf", int(size * 0.66), "Black")
        d.text((size / 2, size * 0.47), "M", font=f, fill=ORANGE, anchor="mm")
        bh = max(2, int(size * 0.07))
        d.rectangle([size * 0.2, size * 0.8, size * 0.8, size * 0.8 + bh], fill=ORANGE)
        return im

    app = ROOT / "app"
    make(512).save(app / "icon.png")
    big = make(180)
    flat = Image.new("RGB", (180, 180), NAVY)  # apple icons must be opaque
    flat.paste(big, (0, 0), big)
    flat.save(app / "apple-icon.png")
    make(256).save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("icons written")


def main():
    loaded = {}
    for name, fname in SOURCES.items():
        img = Image.open(RES / fname).convert("RGB")
        loaded[name] = img
        save_jpg(img, OUT / f"{name}.jpg")
    for name, key, box in CROPS:
        save_jpg(loaded[key].crop(box), OUT / f"{name}.jpg")
    for key in SKETCHES:
        save_jpg(sketch(loaded[key]), OUT / f"{key}-concept.jpg", quality=82)
    og_image()
    icons()
    for p in sorted(OUT.iterdir()):
        w, h = Image.open(p).size
        print(f"{p.name:44s} {w}x{h} {p.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
