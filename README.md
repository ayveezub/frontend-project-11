# 📰 RSS Feed Aggregator

[![Actions Status](https://github.com/ayveezub/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ayveezub/frontend-project-11/actions)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ayveezub_frontend-project-11&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ayveezub_frontend-project-11)

## About

A vanilla JavaScript application for aggregating and reading RSS feeds in one convenient interface.

🔗 Live Demo: [frontend-project-11-rust-zeta.vercel.app](https://frontend-project-11-rust-zeta.vercel.app/)

## Usage

*  Add a Feed: Paste a valid RSS/Atom URL into the input field and click "Добавить"
*  View Entries: New posts appear in the unified feed stream, sorted by date
*  Read Content: Click "Просмотр" to expand full post content
*  Manage Feeds: Added feeds are tracked and auto-updated in the background

## Tech Stack

| **Category**  | **Technology** |
| :--- | :--- |
| Core | Vanilla JavaScript (ES6+ Modules) |
| Build Tool | Vite |
| UI Framework | Bootstrap 5 |
| State Management | Valtio |
| Validation | Yup |
| Utilities | Lodash |
| i18n | i18next |
| Linting | ESLint + @stylistic/eslint-plugin |
| Deployment | Vercel |
| CI/CD | GitHub Actions + SonarQube |

## Project Structure

```
frontend-project-11/
├── .github/workflows/    # CI/CD pipeline configuration
├── public/               # Static assets
├── src/
│   ├── app/              # Application initialization & core logic
│   ├── assets/           # Styles, images, fonts
│   ├── locales/          # i18n translation files
│   ├── modules/          # Feature modules (feeds, UI, parser, etc.)
│   └── main.js           # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
├── eslint.config.js      # ESLint configuration
├── sonar-project.properties # SonarQube settings
├── Makefile              # Convenience commands
└── README.md             # This file
```

## Getting Started

**Prerequisites**

* Node.js >= 18
* npm or yarn

**Installation**

```
# Clone the repository
git clone https://github.com/ayveezub/frontend-project-11.git
cd frontend-project-11

# Install dependencies
make install

# Start development server
make develop
```

**Run Linter**

```
make lint
```

