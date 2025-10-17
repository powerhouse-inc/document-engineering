# Powerhouse Document Engineering

This package provides a set of tools and components for document engineering within the Powerhouse ecosystem.

[![NPM Version](https://img.shields.io/npm/v/@powerhousedao/document-engineering.svg)](https://www.npmjs.com/package/@powerhousedao/document-engineering)
[![License](https://img.shields.io/npm/l/@powerhousedao/document-engineering.svg)](https://github.com/powerhouse-inc/document-engineering/blob/main/LICENSE)

## Installation

```bash
# Using npm
npm install @powerhousedao/document-engineering

# Using yarn
yarn add @powerhousedao/document-engineering

# Using pnpm
pnpm add @powerhousedao/document-engineering
```

## Usage

The package provides several entry points for different use cases:

### Main Package

```typescript
import { ... } from '@powerhousedao/document-engineering';
```

### UI Components

```typescript
import { ... } from '@powerhousedao/document-engineering/ui';
```

### Scalars

For data manipulation and transformation utilities:

```typescript
import { ... } from '@powerhousedao/document-engineering/scalars';
```

### GraphQL

For GraphQL related utilities and schema definitions:

```typescript
import { ... } from '@powerhousedao/document-engineering/graphql';
```

### Styles

To include the package's styles:

```typescript
import '@powerhousedao/document-engineering/style.css';
```

#### Font Requirements

This package uses the **Inter** font family. You must include it in your HTML `<head>` section:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

The `preconnect` links optimize font loading performance by establishing early connections to Google Fonts servers.

## Import Maps

Within the project, the following import maps are available:

- `#assets` - Assets utilities and components
- `#scalars` - Scalar transformations and utilities
- `#ui` - UI components 
- `#graphql` - GraphQL related utilities

## Development

### Prerequisites

- Node.js (LTS version)
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Run storybook for development
pnpm storybook

# Build the package
pnpm build
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Semantic Release

This project uses semantic-release for versioning. Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Release channels:
- `main` branch - Latest stable release
- `staging` branch - Pre-release with staging tag
- `dev` branch - Development pre-release

To make a commit using the conventional format:
```bash
pnpm commit
```

## License

AGPL-3.0-only
