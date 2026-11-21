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
- **Pattern Library** starts with four construction guides and accepts custom styles and instructions. Use a matching sewing pattern for cutting templates and seam allowances.
- **Work Orders** copies the fabric, tools and construction checklist from a style. Check off steps to update progress.
- **3D Fitting Room** rotates a simplified garment on a dress form. Set the form waist and hip and adjust the garment waist, hip or hem length. Generate a tailoring guide and save it as a work order.

- **Sewing Basics** covers Brother CP2160F setup, measuring and cutting, straight seams, and a beginner fabric coaster project.

Data is stored in the current browser for the current site origin. Different browsers and devices have separate data. The 3D model provides a visual approximation. Confirm ease, available seam allowances and the final fit on the physical garment.

## Install on a computer

Open the GitHub Pages deployment in Chrome or Edge and use the install icon in the address bar, or the browser’s app menu. The installed dashboard opens in its own window and can reopen offline after its first online visit. It shares the same browser-profile data as the hosted dashboard.
