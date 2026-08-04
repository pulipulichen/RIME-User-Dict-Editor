# 0.0.1

### Added

- Friendly Electron UI for editing a RIME user dictionary (`terra_pinyin.mine.dict.yaml`).
- Automatic pinyin lookup via Moedict when adding terms.
- Clipboard-based term import and deploy/restart helpers for fcitx5 / Weasel.

### Fixed

- Switch Moedict lookup to the `/uni/` JSON API so automatic pinyin lookup works again after the previous HTML scrape broke.
- Strip tone marks that `slugify` drops (`ǎǒǐǔǖǘǚǜǹḿ`) when normalizing pinyin to ASCII for RIME entries.

### Changed

- Raise JSHint `esversion` from 6 to 8 to match current JavaScript syntax in the client.
