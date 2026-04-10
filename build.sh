#!/bin/bash

# Build script for deploying the X11R7.7 documentation as a static website

# Exit immediately if a command exits with a non-zero status
set -e

# Define build directories
BUILD_DIR="build"
STATIC_DIR="static"

# Clean up previous builds
if [ -d "$BUILD_DIR" ]; then
  echo "Cleaning up previous build..."
  rm -rf "$BUILD_DIR"
fi

# Create build directory
mkdir "$BUILD_DIR"

# Copy necessary files to the build directory
echo "Copying files to build directory..."
cp -r index.html "$BUILD_DIR"
cp -r style.css "$BUILD_DIR"
cp -r docs "$BUILD_DIR"

# Remove unnecessary files for a clean, read-only deployment
find "$BUILD_DIR" -name "*.txt" -exec rm {} +
find "$BUILD_DIR" -name "*.md" -exec rm {} +

# Minify CSS (optional, requires cssnano or similar tool)
# echo "Minifying CSS..."
# cssnano "$BUILD_DIR/style.css" "$BUILD_DIR/style.min.css"
# mv "$BUILD_DIR/style.min.css" "$BUILD_DIR/style.css"

# Finalize
echo "Build completed successfully. Files are in the '$BUILD_DIR' directory."