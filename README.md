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

Select **Fit to model** to use a saved model’s chest, waist, hip and shoulder measurements in the preview and work order. The construction plan adds your selected wearing ease to the applicable finished measurement. A front-view JPG, PNG, or WebP can suggest a garment type, silhouette, sleeve presence and color from visible pixels. Use a well-lit, flat garment on a plain contrasting background. The analysis and thumbnail stay in your browser. Review the suggested design and provide details the photo cannot establish. Use a compatible base pattern and a test garment to establish sizing and cutting shapes.

## Personal models and archives

In **Model Library**, add a model and enter your measurements. Height, inseam, and shoulder-to-wrist length are optional. You can edit your measurements later. In a supported browser, **Shape your form with a camera** captures front and side outlines to approximate your body shape. It uses camera permission and HTTPS. It keeps the derived outline and the measurements in this browser. It does not store photographs, calculate measurements from the camera, or reconstruct a face.

**Show archive** in the Model and Pattern Libraries reveals archived entries and their Restore buttons. In a named garment's revision picker, you can archive the selected revision or the garment's full revision history. Existing work orders can still use archived garments and saved revisions.

## Vanderwood identity and fabric fit preview

The Brand Kit includes the approved condensed Vanderwood wordmark and a charcoal and mushroom palette. Use **Use Vanderwood identity** to apply it in a browser that already has a customized brand kit.

Choose a fabric preset and adjust its mass per area in g/m² in the fitting room. The shading compares estimated crosswise and lengthwise stretch demand against an illustrative nonlinear response for that fabric. Weight affects hang and adds an approximate gravity contribution. **Movement** transitions the full-body form between Standing, Sitting, Reach Forward, and Raise Arms. Depth and width of the front neckline are independent controls, and the back neckline has its own depth control. The Pattern Library includes 27 starter garments.

The preview is a garment fitting aid. It uses procedural body and garment meshes, estimated ease and movement demand, and illustrative material parameters. It does not solve cloth contact, pressure, seam forces, or measured drape. The approach to displaying a deformed shape and color contours was informed by [Ansys Contour Results](https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/motion_ug/motion_ug_using_postproc_contour.html) and [Ansys material nonlinearity documentation](https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/ans_thry/thy_undmat.html).

Use **Sculpt with handles** to select a part of the garment. Drag the on-model handles to edit widths, depths, and lengths or use the arrow keys on a focused handle. Adjustments stay synchronized with the sliders and tailoring work order. **Undo drag** reverses the last handle adjustment.

In **3D Fitting Room**, choose **Make a new garment** to save the current design and a construction work order. **Tailor between revisions** can compare the current fit against the source garment or use a saved revision as the destination. Fitting-room work orders include a measurement sheet, fabric, tools, and ordered illustrated steps. Cut-piece dimensions and seam allowances come from the selected sewing pattern.

The Model Library has six starter forms, including male and female profiles. Optional torso and limb measurements affect the shape and can be saved with fitting revisions. The avatars remain measurement-driven fitting forms. Design Studio and the fitting room share 39 fabric choices with illustrative presets.

## Categorized garment and fabric libraries

The Pattern Library offers 42 in-app garments and 20 free FreeSewing references for distinct cuts, including coats, wrap pants, overalls, swimwear and corsets. Publisher references link to the original drafting, pattern, and sewing instructions. The in-app fitting tool is available for the built-in garment shapes. [FreeSewing catalog](https://freesewing.eu/designs/) · [Commercial-use FAQ](https://freesewing.eu/docs/about/faq/commercial-use/)

The Fabric Library has 127 illustrative presets grouped by fabric type. Upload a JPG, PNG, or WebP swatch, then enter its weight, drape, and stretch. The fitting preview uses the uploaded photo as a repeated color and texture sample. Preset swatches and the fit map are visual approximations. Saved swatches stay in the current browser.

Custom female models offer A–G visual cup profiles alongside full-bust and underbust measurements. Cup presets control projection in the avatar and do not calculate commercial bra sizes.

Work Orders include search, type and progress filters, archival, garment previews, and before/after previews for tailoring orders. Expand the action-by-action guides and the Brother CP2160F settings in each work order. Use the publisher’s pattern for pattern-specific cutting dimensions and assembly instructions.

Use the **Units** selector in the header to switch between centimeters and inches for garment lengths, model measurements, fit adjustments, and work orders. The preference stays in the current browser. Saved measurements retain their original precision when switching views.
