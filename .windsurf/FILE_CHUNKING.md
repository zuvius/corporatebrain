# File Chunking Strategy

> Automatic file splitting when documents become too long for AI context windows

## Why Chunking?

As the project grows, daily changelog and implementation files can become excessively long due to cumulative editing. This causes:
- AI hallucination from context overflow
- Degraded response quality
- Lost information in long documents

## Chunking Rules

### Trigger Conditions

A file MUST be chunked when it exceeds:
- **500 lines** OR
- **20,000 characters** OR
- **Becomes difficult to navigate**

### Changelog Chunking

**File**: `changelog/changelog-YYYY-MM-DD.md`

When limit reached:
1. Rename current file with chunk suffix: `changelog-YYYY-MM-DD-chunk1.md`
2. Create new file: `changelog-YYYY-MM-DD-chunk2.md`
3. Add reference link at top of new file:

```markdown
# Changelog: 2026-04-06 (Part 2)

**Previous**: [Part 1](./changelog-2026-04-06-chunk1.md)
**Date**: [timestamp]
**Session**: [Session Name]

---
```

### Implementation Log Chunking

**File**: `implementation/implementation-YYYY-MM-DD.md`

When limit reached:
1. Rename current file: `implementation-YYYY-MM-DD-chunk1.md`
2. Create new file: `implementation-YYYY-MM-DD-chunk2.md`
3. Add cross-reference at top

### Analysis Document Chunking

**File**: `analysis/YYYY-MM-DD-HHMM-topic.md`

Analysis docs usually don't need chunking (one topic per file). If they exceed limits:
1. Split into sub-topic files: `YYYY-MM-DD-HHMM-topic-part1.md`
2. Create index file linking all parts

## Chunking Process

### Manual Chunking (Preferred)

When you notice a file is getting long:

```bash
# 1. Check line count
wc -l .windsurf/context/changelog/changelog-2026-04-06.md

# 2. If > 500 lines, split at logical boundary (end of major feature/task)
# 3. Rename old file with -chunk1 suffix
# 4. Create new file with -chunk2 suffix
# 5. Add cross-reference links
# 6. Update active-context.md to reference correct chunk
```

### Automatic Chunking (via Script)

Future enhancement: `memory-tracker.js --chunk-check`

Would:
1. Scan all daily files
2. Check line counts
3. Auto-split if limit exceeded
4. Update references

## Cross-Reference Format

Always maintain bidirectional links:

```markdown
# File: changelog-2026-04-06-chunk2.md

**Previous**: [Part 1](./changelog-2026-04-06-chunk1.md) | **Next**: [Part 3](./changelog-2026-04-06-chunk3.md)
```

## Current Chunk Status

| Date | Changelog | Implementation | Analysis |
|------|-----------|----------------|----------|
| 2026-04-06 | Single file | Single file | None yet |

## Active-Context Updates

When chunking occurs, update `active-context.md`:

```markdown
## Recent Changes

### Changelog
<!-- Check changelog/changelog-2026-04-06-chunk2.md for latest -->
[Link to current chunk]
```

## Best Practices

1. **Chunk at logical boundaries** - End of feature, task, or session
2. **Keep chunks under 300 lines** - Easier to read and process
3. **Always add cross-references** - Never orphan a chunk
4. **Update active-context** - Ensure current chunk is discoverable
5. **Archive old chunks** - Move completed chunks to `archived/` subdirectory after 30 days

## Archive Structure

```
.windsurf/context/
├── changelog/
│   ├── changelog-2026-04-06-chunk2.md      (current)
│   └── archived/
│       └── changelog-2026-04-06-chunk1.md (completed)
└── implementation/
    ├── implementation-2026-04-06-chunk1.md   (current)
    └── archived/
        └── implementation-2026-04-05-chunk2.md (old)
```
