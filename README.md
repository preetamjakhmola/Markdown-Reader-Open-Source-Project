# Markdown Reader Extension

Chrome aur Edge browser ke liye Markdown Reader extension - .md files aur folders ko directly browser me render karta hai.

## Features
- .md aur .markdown files ko automatically detect karta hai
- **Folder URLs ko support karta hai** - saari MD files list me dikhti hain
- GitHub jaisa markdown rendering
- Sidebar me Table of Contents (TOC)
- File list sidebar (folder view me)
- Clean aur readable interface
- Syntax highlighting support

## Installation

### Chrome me install karne ke liye:

1. Chrome browser kholen
2. Address bar me type karen: `chrome://extensions/`
3. **"Developer mode"** ON karen (top-right corner me toggle)
4. **"Load unpacked"** button click karen
5. Is folder ko select karen: `e:\Projects\EXTNSIONS\MD_Reader`

### Edge me install karne ke liye:

1. Edge browser kholen
2. Address bar me type karen: `edge://extensions/`
3. **"Developer mode"** ON karen (left sidebar me)
4. **"Load unpacked"** button click karen
5. Is folder ko select karen: `e:\Projects\EXTNSIONS\MD_Reader`

## Usage

### Single Markdown File:

1. Extension install karne ke baad, koi bhi `.md` ya `.markdown` file browser me open karen
   - File → Open File (Ctrl+O)
   - Ya file ko browser me drag & drop karen

2. File automatically render ho jayegi with:
   - Left sidebar me Table of Contents
   - Main area me formatted markdown content

3. TOC me kisi bhi heading pe click karke us section pe jump kar sakte ho

### Folder View:

1. Koi folder URL browser me open karen, jaise:
   ```
   file:///E:/Projects/OFCH_Orderman/Document/D-Client/D--clients-MT-ImpDoc/memory/
   ```

2. Extension automatically detect karega aur UI dikhayega with:
   - **Left sidebar:** Folder ki saari .md files ki list
   - **Middle sidebar:** Current file ka Table of Contents
   - **Main area:** Selected markdown file ka content

3. File list me kisi bhi file pe click karke usko view kar sakte ho

## Important Note

**File Access Permission:**
Extension ko local files access karne ke liye permission deni hogi:

1. `chrome://extensions/` ya `edge://extensions/` pe jaayein
2. "Markdown Reader" extension dhundein
3. **"Details"** button click karen
4. Neeche scroll karke **"Allow access to file URLs"** option ON karen

Bina is permission ke extension local .md files ko render nahi kar payega!

## Files Structure
```
MD_Reader/
├── manifest.json       # Extension configuration
├── content.js          # Main script to detect and render MD files
├── viewer.css          # Markdown styling (GitHub style)
└── README.md           # Documentation
```

## Examples

**Single file:**
```
file:///C:/Users/YourName/Documents/example.md
```

**Folder:**
```
file:///E:/Projects/OFCH_Orderman/Document/D-Client/D--clients-MT-ImpDoc/memory/
```

Extension automatically detect karke render kar dega!

