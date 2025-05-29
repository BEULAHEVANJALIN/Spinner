# Rust WASM Wheel Spinner

A lightweight Rust + WASM based spinning roulette widget.  Input your own list of names in the browser, spin for a random one, then remove and archive the selected ones.

---

## Repository Structure

```
├── Cargo.toml            # Rust crate definition
├── src/
│   └── lib.rs            # Rust spinner implementation
├── pkg/                  # `wasm-pack` output (JS bindings + .wasm)
│   ├── spinner.js
│   ├── spinner_bg.wasm
│   ├── spinner.d.ts
│   └── …
└── static/               # Frontend assets for demo
    ├── index.html        # HTML + modal + canvas wrapper
    ├── index.js          # JS glue (import spinner, render UI)
    └── styles.css        # Light/dark styling + modal
```

---

## Prerequisites

* **Rust Toolchain** (stable): [https://rustup.rs](https://rustup.rs)
* **wasm-pack**:

  ```bash
  cargo install wasm-pack
  ```
* **Python 3** (for simple HTTP server) or any static file server

---

## Build & Generate WASM Bindings

```bash
# from the repo root
wasm-pack build --target web --out-dir pkg
```

This compiles `src/lib.rs` into `pkg/spinner_bg.wasm` and generates the JS bindings in `pkg/spinner.js`, plus TypeScript definitions.

---

## Serve & Test Locally

```bash
# serve `static/` (and pkg/) on localhost:8000
cd static && python3 -m http.server 8000
```

Then open your browser at [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html).  You should see:

1. **Wheel canvas** on the left
2. **Textareas** on the right to enter names & view selected people
3. **Spin** button below the wheel

---

## Usage

1. **Enter** names (one per line or comma separated) in the **"Enter Names"** box.
2. **Spin** the wheel.
3. The styled **modal** will announce the selected entity.
4. The selected one is **removed** from the entry box and **appended** to the **Selected ones** box.

---

## Integrating in your own project

In your HTML:

```html
<script type="module">
  import init, { Spinner } from "./pkg/spinner.js";
  (async () => {
    await init();
    const spinner = new Spinner([ /* names */ ]);
    // … call spinner.update(), spinner.rotation(), spinner.start(), spinner.velocity() …
  })();
</script>
```

Use the `Spinner` API:

* `new Spinner(names: string[])`  - create a new wheel
* `spinner.start()`               - kick off the spin
* `spinner.update()`              - advance animation
* `spinner.rotation(): number`    - current wheel angle (radians)
* `spinner.velocity(): number`    - current spin speed (radians/frame)

---

## License

This project is released under the **MIT** license. See [LICENSE](LICENSE) for details.

---

Happy spinning!
