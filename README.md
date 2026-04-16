# Markdown Reader Extension

A browser extension for **Chrome** and **Microsoft Edge** that renders `.md` and `.markdown` files directly in the browser, including folder browsing for multiple Markdown files.

## Features

- Detects `.md` and `.markdown` files automatically
- **Folder URLs** — lists all Markdown files in a directory
- GitHub-style Markdown rendering
- Sidebar **Table of Contents** (TOC)
- File list sidebar in folder view
- Clean, readable layout
- Syntax highlighting for code blocks

## Installation

### Chrome

1. Open Chrome.
2. Go to `chrome://extensions/`
3. Turn **Developer mode** on (toggle in the top-right).
4. Click **Load unpacked**.
5. Choose the folder that contains this extension’s `manifest.json` (the extension root directory).

### Microsoft Edge

1. Open Edge.
2. Go to `edge://extensions/`
3. Turn **Developer mode** on (sidebar or bottom of the page, depending on version).
4. Click **Load unpacked**.
5. Choose the same extension root folder (where `manifest.json` is).

## Usage

### Single Markdown file

1. After installation, open any `.md` or `.markdown` file in the browser (e.g. **File → Open** or drag-and-drop onto the window).
2. The page should render with:
   - TOC in the left sidebar
   - Formatted content in the main area
3. Click headings in the TOC to jump to sections.

### Folder view

1. Open a `file://` URL that points to a folder on your machine, for example:
   ```
   file:///C:/Documents/notes/
   ```
   (Adjust the drive and path for your OS; on macOS/Linux the form is different, e.g. `file:///Users/you/Documents/notes/`.)
2. The extension can show:
   - **Left:** list of `.md` files in that folder
   - **Middle:** TOC for the current file
   - **Main:** rendered content for the selected file
3. Click a file in the list to open it.

## File URL access (required for local files)

The extension needs permission to read local `file://` pages:

1. Open `chrome://extensions/` or `edge://extensions/`.
2. Find **Markdown Reader**.
3. Open **Details**.
4. Enable **Allow access to file URLs** (wording may vary slightly).

Without this, local Markdown files opened via `file://` may not render correctly.

## Project layout

```
<extension-root>/
├── manifest.json    # Extension manifest
├── background.js    # Service worker / background logic
├── content.js       # In-page detection and rendering
├── viewer.css       # Markdown / viewer styles
├── guide.html       # Guide / help page
├── guide.css        # Guide styles
└── README.md        # This file
```

Replace `<extension-root>` with whatever directory you unpacked or cloned the extension into.

## Examples

**Single file:**

```
file:///C:/Documents/example.md
```

**Folder:**

```
file:///C:/Documents/my-notes/
```

The extension detects Markdown in these contexts and applies the reader UI when appropriate.
