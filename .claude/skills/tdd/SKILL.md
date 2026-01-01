---
name: tdd
description: "Guide for implementing features using Test-Driven Development (TDD) methodology. Use when: (1) User requests to implement a feature using TDD, (2) User asks to write tests first before implementation, (3) User mentions Red-Green-Refactor cycle, (4) Starting a new feature that requires systematic testing. This skill provides step-by-step TDD workflows, concrete test patterns, and best practices for writing tests before implementation in TypeScript/React projects using Vitest."
---

# TDD (Test-Driven Development)

## Overview

This skill guides you through implementing features using the Test-Driven Development methodology. TDD ensures high code quality, comprehensive test coverage, and designs that emerge from tests.

## Core TDD Cycle

```
🔴 Red → 🟢 Green → 🔵 Refactor
  ↑                           ↓
  └───────────────────────────┘
```

### 🔴 Red: Write a Failing Test

1. Choose ONE feature to implement
2. Write the simplest test for that feature
3. Run the test and confirm it fails
4. Verify the failure reason is correct

**Example**:
```typescript
// Test for a feature that doesn't exist yet
describe('calculateTotal', () => {
  it('配列の金額を合計する', () => {
    const result = calculateTotal([100, 200, 300])
    expect(result).toBe(600)
  })
})

// Run: ❌ FAIL - ReferenceError: calculateTotal is not defined
```

### 🟢 Green: Make It Pass (Minimal Implementation)

1. Write the **minimum code** to make the test pass
2. Don't add features not covered by tests
3. Don't optimize prematurely

**Example**:
```typescript
function calculateTotal(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0)
}

// Run: ✅ PASS
```

### 🔵 Refactor: Improve While Green

1. Improve code quality without changing behavior
2. Keep all tests passing
3. Focus on: DRY, naming, structure, types

**When to refactor**:
- After tests pass
- Code duplication appears
- Naming can be clearer
- Function is too complex

**Detailed guidance**: See [references/tdd_cycle.md](references/tdd_cycle.md)

---

## TDD Workflow

### Step 1: Identify the Feature

Break down the feature into small, testable units:

```
Feature: Savings history display
↓
Sub-features:
- Display list of savings records
- Show records in descending order (newest first)
- Display empty state when no records
- Format dates correctly
```

### Step 2: Write the First Test (Red)

Start with the **simplest case**:

```typescript
import { describe, it, expect } from 'vitest'

describe('SavingsHistoryPage', () => {
  it('貯金記録のリストを表示する', () => {
    // Arrange
    const records = [
      { id: '1', amount: 800, recordedAt: new Date('2025-01-01') }
    ]

    // Act
    render(<SavingsHistoryPage records={records} />)

    // Assert
    expect(screen.getByText('¥800')).toBeInTheDocument()
  })
})

// Run: ❌ FAIL - SavingsHistoryPage is not defined
```

### Step 3: Implement (Green)

```typescript
export function SavingsHistoryPage({ records }: Props) {
  return (
    <div>
      {records.map(record => (
        <div key={record.id}>¥{record.amount}</div>
      ))}
    </div>
  )
}

// Run: ✅ PASS
```

### Step 4: Add Next Test (Red)

```typescript
it('記録がない場合は「まだ記録がありません」と表示する', () => {
  render(<SavingsHistoryPage records={[]} />)

  expect(screen.getByText('まだ記録がありません')).toBeInTheDocument()
})

// Run: ❌ FAIL - Unable to find element
```

### Step 5: Implement (Green)

```typescript
export function SavingsHistoryPage({ records }: Props) {
  if (records.length === 0) {
    return <div>まだ記録がありません</div>
  }

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>¥{record.amount}</div>
      ))}
    </div>
  )
}

// Run: ✅ PASS
```

### Step 6: Refactor (Blue)

```typescript
export function SavingsHistoryPage({ records }: Props) {
  if (records.length === 0) {
    return <EmptyState />
  }

  return <RecordList records={records} />
}

// Extracted components for better structure
// Run: ✅ PASS (all tests still pass)
```

---

## Best Practices

### 1. Small Steps

**Good**:
- Write 1 test
- Make it pass
- Repeat

**Avoid**:
- Writing multiple tests before implementing
- Implementing features without tests

### 2. Test Naming (Japanese)

Use descriptive Japanese names that explain the specification:

```typescript
describe('SavingsRecordRepository', () => {
  describe('正常系', () => {
    it('正の金額でレコードを作成できる', () => {})
    it('金額が0の場合も作成できる', () => {})
  })

  describe('異常系', () => {
    it('負の金額の場合はエラーを投げる', () => {})
    it('NaNの場合はエラーを投げる', () => {})
  })
})
```

### 3. AAA Pattern (Arrange-Act-Assert)

Structure every test with three sections:

```typescript
it('レコードを作成する', async () => {
  // Arrange: Setup test data
  const repository = new SavingsRecordRepository()
  const input = { amount: 800 }

  // Act: Execute the function
  const result = await repository.create(input)

  // Assert: Verify expectations
  expect(result.amount).toBe(800)
})
```

### 4. One Assertion Concept Per Test

```typescript
// ✅ Good: One concept per test
it('作成したレコードの金額が正しい', () => {
  const result = repository.create({ amount: 800 })
  expect(result.amount).toBe(800)
})

it('作成したレコードに日時が記録される', () => {
  const result = repository.create({ amount: 800 })
  expect(result.recordedAt).toBeInstanceOf(Date)
})

// ❌ Avoid: Multiple unrelated concepts
it('レコードが正しく作成される', () => {
  const result = repository.create({ amount: 800 })
  expect(result.amount).toBe(800)
  expect(result.recordedAt).toBeInstanceOf(Date)
  expect(result.id).toBeDefined()
})
```

---

## Test Priority Order

Follow this order when writing tests:

1. **Happy Path**: Most common use case
2. **Boundary Values**: 0, empty, min, max
3. **Error Cases**: Invalid input, exceptions
4. **Edge Cases**: Special scenarios

**Example sequence**:
```typescript
// 1. Happy Path
it('正の金額を合計する', () => {
  expect(calculateTotal([100, 200])).toBe(300)
})

// 2. Boundary
it('空配列の場合は0を返す', () => {
  expect(calculateTotal([])).toBe(0)
})

// 3. Error Case
it('NaNを含む場合はエラーを投げる', () => {
  expect(() => calculateTotal([NaN])).toThrow()
})
```

---

## Quick Commands

```bash
# Run tests in watch mode (for TDD)
npm run test -- --watch

# Run all tests once
npm run test

# Run tests with coverage
npm run test:coverage

# Run unit tests only
npm run test -- --run --project=unit
```

---

## TDD Checklist

Before committing:

- [ ] All tests pass (Green)
- [ ] Tests cover the feature specification
- [ ] Test names clearly describe behavior
- [ ] No commented-out tests
- [ ] Refactoring complete (if needed)
- [ ] No implementation without tests

---

## Advanced Patterns

For detailed test patterns and examples:

- **TDD Cycle Details**: [references/tdd_cycle.md](references/tdd_cycle.md)
  - Detailed Red-Green-Refactor workflow
  - Timing and rhythm
  - Common pitfalls

- **Test Patterns**: [references/test_patterns.md](references/test_patterns.md)
  - AAA pattern examples
  - Mock patterns
  - Async testing
  - Edge cases and boundary values
  - Data-driven tests
  - Anti-patterns to avoid

---

## Notes

- **Focus on behavior, not implementation**: Test what the code does, not how it does it
- **Tests are specification**: Test names and assertions should clearly document expected behavior
- **Small cycles**: 5-15 minutes per Red-Green-Refactor cycle
- **Project conventions**: Follow commit message format in `/.claude/CLAUDE.md`
