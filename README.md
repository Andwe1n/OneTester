# OneTester

A desktop-first visual prototype for an all-in-one FTC robot workbench.

Run `npm run dev`, then open http://127.0.0.1:4173. There are no build dependencies. Run `npm run check` to check JavaScript syntax.

Hardware opens on **Settings**, with a compact device list, grouped operating limits and direction, and read-only model, port, and capability information. **Quick test** provides the controls supported by the selected device; **Activity** shows recent commands. Per-device settings drafts survive navigation within the session. Save stores local configuration, and Revert restores the last saved settings.

The prototype also includes named servo positions, sequence previews, an illustrative PID response model, editable trajectory waypoints, demo recordings, and JSON/CSV exports. Saved configuration and presets use browser storage.

All readings and movement are simulated. The connection dialog describes the proposed future integration; it does not connect to or control a robot. The PID model is illustrative, trajectory export is geometry rather than executable Road Runner code, and servo programming means runtime commands and presets rather than vendor firmware programming. Sequences, paths, and recordings are session-only; export them to retain them.

The visual system uses near-black and charcoal surfaces, pale-blue interactive accents, labeled navigation, and compact settings rows. Configuration fields and numeric controls take priority; the hardware workspace has no robot illustration, route preview, or radial gauges. It works best on a laptop or desktop and adapts to smaller screens.

See [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) for the proposed product model, integration boundaries, and brainstorming decisions.
