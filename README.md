# Jessica’s Sewing Dashboard

A browser-based sewing studio with an editable brand kit, a pattern library with 3D design and fitting, illustrated work orders, and beginner sewing lessons.

## Run

Open `dist/index.html` in a modern browser, or serve the site locally:

```sh
python3 -m http.server 8000 --directory dist
```

Then open http://localhost:8000. The project uses plain HTML, CSS and JavaScript and requires no build step. The contents of `dist/` can also be served by a static website host.

## Studio workflow

- **Brand Kit** stores a name, tagline, logo, color palette and guidelines.
- **Pattern Library** holds construction guides, custom designs, and garment revisions. Choose **Fit and revise** to adjust a saved garment on a model or **New custom piece** to start a design.
- **Work Orders** copies the fabric, tools and construction checklist from a style. Choose an optional production size and check off steps to update progress.
- **Sewing Basics** shows Brother CP2160F setup, cutting-board layout, straight seams, and a fabric coaster project. Each illustrated lesson breaks the work into actions and checks. The video library shows seams, neckline finishes, and sleeve construction.

Data is stored in the current browser for the current site origin. Different browsers and devices have separate data. The 3D model provides a visual approximation. Confirm ease, available seam allowances and the final fit on the physical garment.

## Use a construction work order

**Fabric quantities** lists each material in yards and meters. Use **Edit fabric width and cutting list** to record the usable width and full cutting list for each fabric. With those values, the packet lists where to place each full-size paper piece, how many to cut and when to use a fold or mirror a pair. Estimates include a 10% reserve and round up to the next 10 cm. Original guide amounts and publisher instructions retain their own source labels.

**Dimensions between reference marks** shows the distances that position the circumference lines and garment features. Enter the actual wearer, sample or paper measurements under **Pattern measurements, cutting and options** to replace the marked estimates. The illustrated checklist includes detailed actions for preparation, cutting, machine setup, construction, pressing and fit checks. Use the full-size paper pattern for the cutting shapes and record any dimensions or allowances flagged under **Before cutting and sewing**. Print the open work order from the browser for a paper copy.

## Install on a computer

Open [Jessica’s Sewing Dashboard](https://jessicavvanderwood-sketch.github.io/Sewing/dist/). In Safari on macOS Sonoma or later, choose **File → Add to Dock**. In Chrome or Edge, use the app install option in the address bar or browser menu. The installed dashboard opens in its own window and can reopen offline after its first online visit. GitHub Pages automatically publishes updates from main. Studio data is stored in the browser or installed app profile you use.

## Fit a model and keep garment revisions

1. Open **Model Library** and choose a preset form or create one from measurements. A custom model can also include an upright, low-poly OBJ torso under 1 MB with Y pointing up and the front toward +Z. Enter actual measurements separately.
2. In **Pattern Library**, select **Fit and revise** on a garment. Choose the model and fabric, then adjust the fit. The controls follow the garment’s cut and features.
3. Choose **Tailor between revisions** to compare changes against the starting garment or use a saved revision as the target. Choose **Make a new garment** to save the fit as a separate design with a construction work order.
4. Use **View guide and revisions** to select an earlier version. Choose **Fit and revise** to start from it or **Make this revision again** to copy its construction and alteration sequence into a fresh work order.

Tool photos show representative examples. The Brother machine photo links to the accompanying official resources in Sewing Basics. Use a sewing sample to check the preview’s estimated drape and fit.

## Preview on different models and compare sizes

Select a garment image in **Pattern Library** or **Work Orders** to open a view-only try-on. Choose a model, drag left or right to turn it and up or down to tilt it, or use the Front, Side and Back buttons. Use **Movement** to select a pose or play an animation. In the design or fit editor, use **Preview on models** to inspect the current design.

Each garment has XXS, XS, S, M, L, XL and XXL. M uses the saved fit. The dashboard grades the other sizes from that fit and holds the garment size steady when you switch models. The grades are specific to this dashboard. Choose the same size when you create or remake a work order to record the corresponding grading instructions. For linked publisher patterns, follow the publisher’s draft and size chart.

## Design a garment or use a reference photo

Open **Pattern Library → New custom piece** to combine a silhouette, length, neckline, sleeves, color, and fabric in the design editor. Optional settings add pockets, a closure, target ease, and finish details. The 3D preview shows the main shape and color, and the illustrated construction plan covers sewing details such as pockets and closures. Save to the Pattern Library, or save and create a work order immediately.

Open **Pockets** in a new design or when revising a saved design. Add pockets one at a time or start with a paired layout. Adjust each pocket’s placement, width, depth, and opening separately. Patch pockets can wrap around the body or go on either trouser leg, and have their own outline and rotation. In-seam pockets attach to a side seam. Select a pocket on the model to open its settings. Work orders show a numbered set of measurements and construction figures for each new pocket.

Choose **Strapless** for a dress or top with an elastic top edge or a structured bodice. Corsets use structured support. Open **Strap curve and taper** or select a strap in the preview. The front and back groups set their own curve, width, depth along the bodice, and join angle. Halter straps have a rear collar that uses curve and width controls. Sleeve choices include Flutter, Bishop, and Tapered, alongside the width, length, cap, and cuff sliders.

Choose a back style, including Boat back, Soft V-back, and Deep U-back. **Back neckline fit** gives the rear opening its own width and depth. In **Strap curve and taper**, change the distance between the rear anchors or shift them toward the wearer’s left or right.

Select **Cut the front strap and bodice in one piece** or the equivalent back option where available. **One-piece construction** in **Seams** also offers continuous dress waists, panels, and trouser legs. The options account for closures, pockets, and contrast panels that need a seam. The work order shows the combined pattern outline and the edges that still need seam allowances.

In the front and back strap join controls, set the neckline and armhole corners independently to **Sharp**, **Chamfer**, or **Round**. The setback measures along each edge from the original corner. Use the same setting when tracing the lining or facing. The work order includes the selected setback and a drawing of the new edge.

Open **Trims & details** to add lace to the upper edge, sleeve openings, hems, pocket openings, trouser waistbands or seams. Select the lace style, color, and width for each placement. Each fabric layer also has a separate lace option at its hem. Choose **Stitched details** for a gathered ruffle, knife, box or inverted pleats, or pintucks. Set the placement and depth, then the spacing or gathering ratio.

Under **Seam overlay**, place lace centered, left, or right of the seam. Centered trim can use the same style, width, and color as an in-seam pocket it meets. Keep the pocket mouth free when stitching the trim.

Open **Seams → Ruffle attachment seams** in New custom piece, or open **Ruffle attachment seams** in Fit and revise. Add a seam and choose how far down it sits from the upper edge at the side to the main hem. Add a gathered ruffle and set its finished drop and fullness, or start with **Add ruffle tiers**. Select a seam or tier in the preview to reach its controls. Work orders show where to mark each row, how to calculate strip length, and how to sew the tiers from the bottom up.

Open **Slits** under **Trims & details** or in **Fit and revise**. Choose the main hem, either trouser leg, or either sleeve where fitted. Set the position, length from the finished hem, and opening width. A width of zero brings the edges together at rest. Sleeve options include a faced vent, bound placket, and button-and-loop vent. The work order shows where to stop cutting and how to finish the selected opening. [Sleeve Plackets and Bands](https://pubs.nmsu.edu/_c/C222/index.html)

Choose **Keyhole** at the front or **Keyhole back** in Back style. Set the shape, width, depth, position below the neckline and bridge or button-loop finish for each opening. **Notched** adds a narrow split at the front edge, with width and depth in Fit. [Creating Rouleau Button Loops](https://www.seamwork.com/sewing-tutorials/creating-rouleau-button-loops) · [Notched Carpe Diem Top](https://fitforartpatterns.com/2022/05/03/notched-carpe-diem-top/)

Open **Left and right fit → Back neckline** to change the width and depth on the wearer’s left and right separately. Select either rear edge in the preview to open its controls. In **Fit and revise**, use **Left and right back neckline**. The work order records each changed side and shows how to trace the matching facing.

Choose a button closure to edit the button count, diameter, spacing and first position. **Wrap ties** offers length, width and placement. **Drawstring waistband** is available for trousers and skirts and includes cord dimensions, casing depth and exit placement. Illustrated work orders show the selected measurements.

Select **Fit sliders** to open the **Fit adjustments** panel. Both workflows use the same sliders, fabric weight, stretch and drape settings, poses, motion playback, and tightness map. Saved designs keep their fabric and fit settings for revisions and construction work orders.

Use **Design**, **Fit**, **Seams**, **Layers**, or **Trims & details** to browse related controls beside the preview. Select a visible garment detail to highlight it, switch to its panel, and focus the matching control. **Edit on garment** can show extra seam guides or focus left and right fit on one side. **View only** lets you inspect the preview without selecting controls. Drag the canvas to rotate and use the tilt and zoom controls to inspect a detail. Undo and redo apply to fit, seams, layers, trims, and closure edits.

In **Seam placement**, move the front seam offset slider inward until the seams merge, or select **Merge front seams**. Select the merged seam to open its position slider. In **Seam and zipper settings**, enable a standard or invisible zipper and use the opening length slider to set its stop. The illustrated work order marks the seam location, the opening length, and where to sew below the zipper.

**Layers** adds up to five layers to any design. Dresses and skirts offer overskirts, underskirts, tiers, and ruffles. Tops, corsets, and pants offer overlays, linings, tiers, and ruffles. Pants layers follow both legs separately. Open **Attachment and fullness** to set the height or drag the highlighted attachment edge. The height is measured toward the base hem from the waist for dresses and skirts, from the upper edge for tops and corsets, and from the upper leg for pants. Dress layers can also attach above the waist. Each layer keeps separate fullness, hem shape, and lace settings.

Use **Left and right fit** for different sleeve lengths, neckline depths, body widths, front panel positions, or pant leg lengths. Pick the wearer’s side before adjusting it. A one-shoulder design can use either side. The work order records the sided offsets and contour settings, with figures for transferring them to a fitting sample and paper pattern.

Select **Fit to model** to use a saved model’s chest, waist, hip and shoulder measurements in the preview and work order. The construction plan adds your selected wearing ease to the applicable finished measurement. A front-view JPG, PNG, or WebP can suggest a garment type, silhouette, sleeve presence and color from visible pixels. Use a well-lit, flat garment on a plain contrasting background. The analysis and thumbnail stay in your browser. Review the suggested design and provide details the photo cannot establish. Use a compatible base pattern and a test garment to establish sizing and cutting shapes.

## Personal models and archives

In **Model Library**, add a model and enter your measurements. In the model editor, open **Shape your form with a camera**. Keep your head and feet in view and tap the preview if you need to move the guide toward yourself. Take a front capture, turn to the side, and take a side capture from the same spot. The app uses both outlines to approximate your shape and uses your entered measurements for sizing. Camera frames are processed on your device. The saved model contains your measurements and numeric outline ratios. Camera access requires permission and HTTPS. See [camera model and runtime credits](dist/vendor/mediapipe/NOTICE.txt).

**Show archive** in the Model and Pattern Libraries reveals archived entries and their Restore buttons. In a named garment's revision picker, you can archive the selected revision or the garment's full revision history. Existing work orders can still use archived garments and saved revisions.

## Vanderwood identity and fabric fit preview

The Brand Kit includes the approved condensed Vanderwood wordmark and a charcoal and mushroom palette. Use **Use Vanderwood identity** to apply it in a browser that already has a customized brand kit.

Choose a fabric preset and enter its weight in g/m². Under **Fabric stretch and drape**, set crosswise stretch, lengthwise stretch, and drape firmness. The tightness map compares estimated stretch demand against an illustrative nonlinear response for the fabric. **Movement** includes static poses and playable motions. Neckline controls adjust the front depth, front width, and back depth independently.

Choose a pose or motion and use its **Add ease** button to adjust room for that movement. **Add ease for all movements** checks the available poses and motion loops and proposes one set of changes. The preview uses estimated ease, simplified garment contact, and illustrative material parameters. Verify movement and fit on a sewing sample. The shape and color contours draw on [Ansys Contour Results](https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/motion_ug/motion_ug_using_postproc_contour.html) and [Ansys material nonlinearity documentation](https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/ans_thry/thy_undmat.html).

Select a region of the garment to open its fit slider. Use sliders to adjust fit while the selected region is highlighted. Adjustments carry into revisions and tailoring work orders.

Work orders generated from a 3D fit include a measurement sheet, fabric, tools, and illustrated steps. Cut-piece dimensions and seam allowances come from the selected sewing pattern.

The Model Library has six starter forms, including male and female profiles. Optional torso and limb measurements affect the shape and can be saved with fitting revisions.

## Categorized garment and fabric libraries

The Pattern Library offers 42 in-app garments and 20 free FreeSewing references for distinct cuts, including coats, wrap pants, overalls, swimwear and corsets. Publisher references link to the original drafting, pattern, and sewing instructions. The in-app fitting tool includes style previews for the Hugo Hoodie and Sven Sweatshirt. Their original FreeSewing drafts provide the cutting dimensions. [FreeSewing catalog](https://freesewing.eu/designs/) · [Commercial-use FAQ](https://freesewing.eu/docs/about/faq/commercial-use/)

The Fabric Library has 127 illustrative presets grouped by fabric type. Upload a JPG, PNG, or WebP swatch, then enter its weight, drape, and stretch. The fitting preview uses the uploaded photo as a repeated color and texture sample. Preset swatches and the fit map are visual approximations. Saved swatches stay in the current browser.

Custom female models offer A–G visual cup profiles alongside full-bust and underbust measurements. Cup presets control projection in the avatar and do not calculate commercial bra sizes.

Work Orders include search, type and progress filters, archival, garment previews, and before/after previews for tailoring orders. Expand the action-by-action guides and the Brother CP2160F settings in each work order. Under **Pattern measurements, cutting and options**, record paper-piece dimensions, quantities, grainline alignment, seam allowances, and feature placements. Enter values from the pattern or fitting sample to label the figures. The original pattern supplies the cutting shapes and pattern-specific construction order.

Use the **Units** selector in the header to switch between centimeters and inches for garment lengths, model measurements, fit adjustments, and work orders. The preference stays in the current browser. Saved measurements retain their original precision when switching views.

The Model Library uses barefoot height and body inseam to place the head, crotch, and floor. Optional waist-to-floor and shoulder-to-waist measurements locate the waist and shoulder. The model editor includes a measurement diagram. These lengths are used by the pose rig, and existing saved profiles update from the measurements they already contain.

Work order figures mark common assembly and fold steps. Enter the pattern’s seam allowance and hem turns under **Pattern allowances for the figures** to label the diagrams with project values. Tailoring figures can also label saved seam shifts and hem moves. The figures indicate where to measure and are not cutting templates.

For female models, enter full bust and underbust together for the projection estimate. Bra size is optional and can help if underbust is missing. Use **Side view** in the model editor to check the shape. An optional projection measurement is available for fine-tuning.

In **Fabric Library → Add fabric**, use **Open camera → Take photo** to capture a square swatch in the app, or choose an existing image. Preview or retake it before saving. Choose a fabric type for starting estimates, and expand **Weight, drape and stretch** to enter measured values. The app requests camera permission when opened, and stops the stream after a capture or when the dialog closes.

The measurement-based fitting form places adjustable landmarks for the waist, crotch, knee, chin, and bust. Cross sections are scaled to their entered girths. At the bust, the model estimates the path of a taut tape around the section, including the added front volume. Optional bust spacing and height place the two rounded contours. The form estimates shape from these measurements and can vary from a person's scan.

Modeling references include the [ISO 8559-1 apparel measurement definitions](https://gso-sims-preview-doc-aws.s3-eu-west-1.amazonaws.com/gso-iso-8559-1-2017-en.html), the [GarmentCodeData body measurement method](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07721.pdf), and [SMPL's scan-trained body shape and pose research](https://is.mpg.de/publications/smpl-2015).

### Detailed human preview

The Model Library renders a continuous standing body mesh with female and male starting profiles, anatomical surface geometry, measurement-driven proportions, and GPU lighting where WebGL is available. Front, three-quarter, side, and back views are available in the model editor. An optional camera outline adjusts torso aspect ratio. Optional torso depth and height, arm segment length, forearm girth, and leg and foot measurements refine the shape. Smooth interpolation follows the measured landmarks. The garment preview uses the selected avatar in static poses and playable, scrubbable walk, sit-to-stand, and arm-motion loops.

The model editor estimates blank landmark heights using adult references and the measurements you enter. As a starting point, crotch height is about 48% of stature, kneecap height is about 57–58% of crotch height, shoulder height is about 82% of stature, and the fullest part of the seat is about 50–51% of stature. These estimates draw on medians from the adult US Army ANSUR II sample. The waist, chest, and intermediate surface landmarks also use the fitting mesh and sewing measurement locations. An entered barefoot body inseam, natural-waist height, or other compatible landmark takes precedence. See [ANSUR II data and measurement manual](https://mreed.umtri.umich.edu/mreed/downloads.html) and [ISO apparel measurement landmarks](https://gso-sims-preview-doc-aws.s3-eu-west-1.amazonaws.com/iso-8559-1989-en.html).

The preview uses the [MakeHuman base mesh](https://github.com/makehumancommunity/makehuman/blob/master/makehuman/data/3dobjs/base.obj) and [MPFB adult morph targets](https://github.com/makehumancommunity/mpfb2/tree/master/src/mpfb/data/targets/macrodetails), released under [CC0 1.0](https://www.makehumancommunity.org/about/license.html). The generation command and asset inputs are documented in `scripts/build-human-mesh.py`. The geometry ships with the dashboard and the preview runs on the device.

In **Design Studio**, use **Custom fields** to build from a garment type or **Photo reference** to take or upload a photo. Confirm a camera capture with **Use photo**. The photo analysis happens on the device and suggests a starting silhouette and visible details. The selected model provides the measurements. Review fabric, back, closure, and construction choices before saving. Design fields include neckline, straps, back styles, pant cuts and rise, structured bodices and corsets, and compatible closures.

### Posing and cloth contact

The garment preview uses MakeHuman/MPFB’s CC0 game-engine skin weights. Shoulder, elbow, hip and knee joints preserve segment lengths. Blended rigid joint transforms retain volume around bends. [MPFB game-engine skin weights](https://github.com/makehumancommunity/mpfb2/blob/master/src/mpfb/data/rigs/standard/weights.game_engine.json) · [Blender Armature Preserve Volume](https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html)

The browser projects bodice and skirt points outside cross-sections of the posed avatar, with a small clearance. Stretch and bending settings influence how the surface settles between its attachment points and moving edges. This takes cues from [Blender’s cloth collision settings](https://docs.blender.org/manual/en/5.3/physics/cloth/settings/collisions.html) and [Position Based Dynamics](https://doi.org/10.2312/PE/vriphys/vriphys06/071-080). It is a preview with simplified contact and material behavior. Use a sewing sample to verify the actual drape, movement and fit.

Use **Reanalyze photo** on an attached garment reference to update the suggested features. Confirm the straps and **Hem shape** in the design fields. The fairy hem has an editable high-to-low drop. Set the drop from your design or fitting sample. Work orders and the fitting preview label recorded dimensions on drawings, with reference marks for recognizable photo features.

In **Fit and revise**, open **Shoulders and sleeves** to choose a shoulder construction, set the finished width and placement, and add cap, short, elbow, long, puff or bell sleeves to integrated shoulders. For a strapless garment, select **Strapless**. These changes carry into the saved revision and the work-order figures.

For dresses and skirts, **Seated fit** adjusts upper-hip circumference, back seat depth, front lap room, knee room and extra center-back length. View **Sitting** to use **Add sitting ease**. Confirm those changes on a seated fitting sample before cutting the final fabric.
