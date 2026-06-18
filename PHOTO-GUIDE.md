# Hatch Website — Photo Guide

A simple guide for adding, swapping and managing images on the Hatch website.

---

## Folder Structure

```
images/
├── hero/        ← Main banner image of the Hatch fridge
├── products/    ← Food product photos (meals, drinks, snacks)
├── spaces/      ← Photos of fridges installed in real locations
└── brand/       ← Logos and favicon
```

---

## How to Swap the Hero Image

1. Put your new image in the `images/hero/` folder
2. Name it `fridge-office.jpg` (replacing the existing one)
3. Refresh the page — done!

**Recommended size:** portrait, around 1122 x 1402 pixels, JPG format
(Keep it under ~250 KB so the page stays fast.)

---

## How to Add a New Food Product

1. Put your product photo in `images/products/`
2. Name it something simple like `chicken-tikka.png` (lowercase, hyphens, no spaces)
3. Open `index.html` in a text editor (e.g. Notepad or VS Code)
4. Find the section that says `food-showcase`
5. Copy one of the existing blocks that looks like this:

```html
<div class="food-card">
  <img src="images/products/YOUR-FILE-NAME.png" alt="Your Product Name" loading="lazy" data-folder="products" onerror="this.classList.add('img-missing')" />
  <div class="food-card-label">Your Product Name</div>
</div>
```

6. Paste it next to the other food cards
7. Change the filename and label text
8. Save and refresh

**Recommended size:** 600 x 600 pixels, PNG format (transparent background ideal)

---

## How to Add a Space / Installation Photo

1. Put your photo in `images/spaces/`
2. To replace the "In Your Space" in-situ photo (next to the Sectors section),
   name it `fridge-loft.jpg`
3. Refresh the page

**Recommended size:** portrait, around 1122 x 1402 pixels, JPG format
(`fridge-situ.jpg` is an older unused shot kept for reference.)

---

## How to Update Logos

- **White logo** (used in nav and footer): Replace `images/brand/logo-white.png`
- **Green logo** (if needed): Replace `images/brand/logo-green.png`
- **Favicon** (browser tab icon): Replace `images/brand/favicon.png`

---

## Image Naming Rules

- Use **lowercase** letters only
- Use **hyphens** instead of spaces: `lamb-rendang.png` not `Lamb Rendang.png`
- Keep names short and descriptive
- Accepted formats: `.jpg`, `.png`, `.webp`

---

## What Happens If an Image Is Missing?

The website shows a branded green placeholder with an "H" watermark. The page will still look professional while you add photos over time.

---

## Quick Reference — Recommended Sizes

| Folder    | Use                    | Size         | Format   |
|-----------|------------------------|--------------|----------|
| hero/     | Main banner image      | 1400 x 800   | JPG      |
| products/ | Food product cards     | 600 x 600    | PNG/WebP |
| spaces/   | Fridge-in-situ photos  | 1400 x 800   | JPG      |
| brand/    | Logos                  | Any          | PNG      |
| brand/    | Favicon                | 512 x 512    | PNG      |
