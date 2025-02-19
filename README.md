# Image Folder Optimizer

Personal CLI tool to optimize and convert images in bulk for PNG, JPEG, WebP, and AVIF formats.

## Installation

```bash
npm install   # or
pnpm install 
```

## Usage

### Interactive CLI
```bash
pnpm run cli
```

### Direct Scripts
```bash
# Process folder
pnpm run optimize:folder

# Process single image
pnpm run optimize:image
```

## Configuration

Create a `.env` file:
```env
# Required
INPUT_PATH=/path/to/input
FORMAT=png|jpeg|webp|avif

# Optional
OUTPUT_PATH=/path/to/output  # Default: ./output
ISLOSSLESS=false             # Default: false
QUALITY=80                   # Default: 80
```

Note: For Windows, use paths like `C:\path\to\input`

## Supported Formats

Input: PNG, JPEG/JPG, WebP, AVIF
Output: PNG, JPEG, WebP, AVIF

## License

This project is licensed under the [MIT License](LICENSE).
