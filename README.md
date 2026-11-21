# Jessica’s Sewing Dashboard

A browser-based sewing studio with an editable brand kit, a garment style and cut library, work orders, a 3D fitting room, and beginner sewing lessons.

## Run

Open `dist/index.html` in a modern browser, or serve the site locally:

```sh
python3 -m http.server 8000 --directory dist
```

Then open http://localhost:8000. The project uses plain HTML, CSS and JavaScript and requires no build step. The contents of `dist/` can also be served by a static website host.

## Studio workflow

- **Brand Kit** stores a name, tagline, logo, color palette and guidelines.
- **Pattern Library** starts with five construction guides and accepts custom styles and instructions. Use a matching sewing pattern for cutting templates and seam allowances.
- **Work Orders** copies the fabric, tools and construction checklist from a style. Check off steps to update progress.
- **3D Fitting Room** rotates a simplified garment on a dress form. Set the form waist and hip and adjust the garment waist, hip or hem length. Generate a tailoring guide and save it as a work order.

- **Sewing Basics** covers Brother CP2160F setup, measuring and cutting, straight seams, and a beginner fabric coaster project.

Data is stored in the current browser for the current site origin. Different browsers and devices have separate data. The 3D model provides a visual approximation. Confirm ease, available seam allowances and the final fit on the physical garment.

## Install on a computer

Open [Jessica’s Sewing Dashboard](https://jessicavvanderwood-sketch.github.io/Sewing/dist/). In Safari on macOS Sonoma or later, choose **File → Add to Dock**. In Chrome or Edge, use the app install option in the address bar or browser menu. The installed dashboard opens in its own window and can reopen offline after its first online visit. GitHub Pages automatically publishes updates from main. Studio data is stored in the browser or installed app profile you use.

## Fit a model and keep garment revisions

1. Open **Model Library** and choose a preset form or create one from measurements. A custom model can also include an upright, low-poly OBJ torso under 1 MB with Y pointing up and the front toward +Z. Enter actual measurements separately.
2. Pick a garment in the **3D Fitting Room**. The controls depend on its cut. Dresses and shirts can show sleeve controls. Pants offer waist, seat, thigh, leg opening, rise and length adjustments.
3. Generate the illustrated tailoring steps, name the garment and save its revision and work order together.
4. Open that garment in **Pattern Library** to choose a saved revision. **Revise this fit** creates another revision. **Make this revision again** copies the selected revision’s construction and alteration sequence into a fresh work order.

Tool photos show representative examples. The Brother machine photo links to the accompanying official resources in Sewing Basics. The garment preview uses simplified geometry and does not simulate cloth drape or validate pattern pieces.

## Design a garment or use a reference photo

Open **Design Studio** to combine a silhouette, length, neckline, sleeves, color, and fabric. Optional settings add pockets, a closure, target ease, and finish details. The 3D preview shows the main shape and color, and the illustrated construction plan covers sewing details such as pockets and closures. Save to the Pattern Library, or save and create a work order immediately.

A front-view JPG, PNG, or WebP can suggest a garment type, silhouette, sleeve presence and color from visible pixels. Use a well-lit, flat garment on a plain contrasting background. The analysis and thumbnail stay in your browser. Review the suggested design and provide details the photo cannot establish. Use a compatible base pattern and a test garment to establish sizing and cutting shapes.
