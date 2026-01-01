---
name: ci-fix
description: "Diagnose and fix CI/CD failures related to Lint errors and test failures. Use when: (1) User mentions CI/CD failures, lint errors, or test failures, (2) User asks to fix code quality issues or make tests pass, (3) User requests to check or verify code before committing/pushing, (4) Working on a task that requires running lint or tests to validate changes. This skill provides systematic workflows for identifying, diagnosing, and fixing common Lint and test errors in TypeScript/React projects using ESLint, Prettier, and Vitest."
---

# CI Fix

## Overview

This skill provides systematic workflows for diagnosing and fixing CI/CD failures caused by Lint errors and test failures. It covers common error patterns in TypeScript/React projects and provides step-by-step remediation procedures.

## Workflow

### Step 1: Run Lint Check

Execute lint check to identify code quality issues:

```bash
cd app && npm run lint
```

**Check:**
- Error count
- Error types (Prettier, TypeScript, ESLint)
- Affected files

**Auto-fix attempt:**
```bash
cd app && npm run lint -- --fix
```

Most Prettier formatting errors can be auto-fixed with the `--fix` flag.

### Step 2: Run Unit Tests

Execute unit tests (excluding Storybook tests):

```bash
cd app && npm run test -- --run --project=unit
```

**Check:**
- Pass/fail count
- Failed test names and error messages
- Stack traces

### Step 3: Diagnose Errors

For detailed error patterns and fixes:

**Lint errors:**
- See [references/lint_errors.md](references/lint_errors.md) for:
  - Prettier formatting errors
  - TypeScript `any` type errors
  - Storybook import warnings
  - ESLint rule violations

**Test errors:**
- See [references/test_errors.md](references/test_errors.md) for:
  - Expectation mismatches
  - Mock function issues
  - React act() warnings
  - Timeout errors
  - Common stderr messages (informational only)

### Step 4: Fix Errors

Apply fixes based on diagnosis:

1. **Auto-fixable errors:** Already fixed by `--fix` command
2. **Manual fixes:** Follow patterns in reference files
3. **Test fixes:** Determine whether to fix test or implementation based on specification

**Key decision point for test failures:**
- Read test code → Understand intent
- Read implementation → Understand behavior
- Check specification/requirements
- Decide: Fix test or fix implementation?

### Step 5: Verify Fixes

Re-run checks to confirm all errors are resolved:

```bash
# Verify lint
cd app && npm run lint

# Verify tests
cd app && npm run test -- --run --project=unit
```

**Success criteria:**
- Lint: 0 errors
- Tests: All passing (e.g., 124/124 passed)

### Step 6: Commit & Create PR

Follow project commit conventions (Japanese commit messages):

```bash
git add .
git commit -m "$(cat <<'EOF'
fix: Lintエラーとテストエラーを修正

- Prettierフォーマットエラーを自動修正
- TypeScript any型を明示的な型に変更
- テストの期待値を仕様に合わせて修正

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**Create PR with:**
- Title: Same as first commit line
- Description: Detailed changes in Japanese
- Test plan checklist

## Quick Reference

### Common Commands

```bash
# Lint check
cd app && npm run lint

# Auto-fix lint errors
cd app && npm run lint -- --fix

# Run unit tests only
cd app && npm run test -- --run --project=unit

# Build check (optional)
cd app && npm run build
```

### Pre-commit Checklist

Before committing fixes:

- [ ] `npm run lint` returns 0 errors
- [ ] `npm run test -- --run --project=unit` all tests pass
- [ ] Changes align with specifications
- [ ] Commit message follows project conventions
- [ ] PR description is complete

## Resources

### references/

- **lint_errors.md**: Detailed Lint error patterns and fixes
  - Prettier formatting
  - TypeScript `any` types
  - Storybook imports
  - ESLint rules

- **test_errors.md**: Detailed test error patterns and fixes
  - Expectation mismatches
  - Mock setup issues
  - Async handling
  - React warnings

## Notes

- **stderr messages**: Many stderr messages during tests are intentional (error handling tests) - focus on whether tests pass/fail
- **Storybook tests**: Separate project - if unit tests pass, Storybook test failures can be addressed separately
- **Specification priority**: When in doubt, check project docs (`/.claude/CLAUDE.md`, `/aidlc-docs/`) to determine correct behavior
