# Copilot Instructions

## Overview
This workspace contains documentation and resources for the X Window System (X11R7.7). The following instructions guide AI agents to navigate and contribute effectively.

## Key Directories and Files
- **`docs/`**: Contains protocol, library, and release documentation.
  - Example: `docs/xorg-docs/README.txt` provides an overview of X11R7.7.
  - Example: `docs/xorg-docs/ReleaseNotes.txt` details new features and build changes.
- **`README.md`**: High-level project goals and usage.

## Build and Test Commands
Currently, no explicit build or test commands are defined in the workspace. Agents should:
- Look for build instructions in `README.md` or `docs/`.
- Reference the Modular Developer's Guide in the X.Org wiki for modular builds.

## Conventions
- Follow modular development practices as described in `ReleaseNotes.txt`.
- Use the "Link, don't embed" principle to reference existing documentation.

## Potential Pitfalls
- Ensure compatibility with UNIX-like systems (Linux, FreeBSD, etc.).
- Verify dependencies for individual modules before building.

## Suggestions for Improvement
- Add a `CONTRIBUTING.md` file to outline contribution guidelines.
- Define build/test commands explicitly in the `README.md`.

## Example Prompts
- "Summarize the key features of X11R7.7 from `ReleaseNotes.txt`."
- "List the protocols documented in `docs/`."
- "Generate a build script for the modular tree based on the Modular Developer's Guide."