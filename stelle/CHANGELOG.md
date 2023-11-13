# Change Log

All notable changes to Stelle will be documented in this file.

## Releases

- [1.0.0](#100---2023-11-09)
- [1.0.1](#101---2023-11-09)
- [1.0.2](#102---2023-11-10)

### Unreleased

- Implementation of Google Vertex AI
- Updat Visual Identity
- Update Visuals in `README.md` & `CHANGELOG.md`

### Issues

- User currently has no way to submit issues other than the Q&A section of the marketplace.
- `openai` package not installing properly for users. (See [1.0.2](#102---2023-11-10) for current fix)

## [1.0.0] - 2023-11-09

_Initial Release._

Stelle has enough functionality to launch! Stelle is a programming assistant made to help user's learn how to code or help more advanced programmers code more efficiently. Stelle does this by embracing the power of AI tools. Stelle provides users with direct in-editor assistance through conversation or even quick context-menu prompts. The goal for Stelle is to have numerous AI models working together to provide users the best overall experience!

### Added

- Add right-click context menu
    - Add `stelle.analyze`
    - Add `stelle.comment`
    - Add `stelle.fill`
    - Add `stelle.fix`
    - Add `stelle.optimize`

- Add webview for direct interaction
    - Add `stelle.start`

## [1.0.1] - 2023-11-09

Small hot-fix patch in attempt to resolve user issues with `openai`.

Upon release, I asked a few people to try out the application and see how it would run. They informed me that the current state of the project would not run due to the dependency `openai` being missing. In an effort to fix this, I adjusted the dependencies in the project manifest.

### Changed

- Updated `package.json` & `package-lock.json`

## [1.0.2] - 2023-11-10
 
Previous adjustments to the `package.json` and `package-lock.json` did not fix the issue of `openai` not appearing in user's `node_modules` folder. The newly added fix now manually handles all dependencies the project may need.

### Changed

- Update `package.json`

### Added

- Add `dependencyManager.ts`
- Added configurations (Extension Settings);