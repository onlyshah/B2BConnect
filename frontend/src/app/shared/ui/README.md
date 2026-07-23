# Shared UI architecture

This folder contains the reusable enterprise UI building blocks used across the Angular workspace.

## Principles
- Reuse shared primitives instead of creating one-off cards, tables, or toolbars per feature.
- Keep layout shells and data presentation components domain-agnostic.
- Feature-specific logic should live in feature services and feature components, not in shared UI.

## Available primitives
- ui-page-shell
- ui-card
- ui-list-toolbar
- ui-empty-state
- ui-data-table
- ui-form-field
- ui-kpi-card
