# Research & Editorial Platform | Abdullah Hossam 🎓🏛️

A high-density, "Zero-Path" academic portfolio designed for severe portability and rigorous editorial control. This platform transforms static research papers into a continuous, bilingually-optimized reading experience.

## ✨ Core Features
*   **Editorial Engine**: Continuous scrollable reading flow with a persistent dynamic Table of Contents (TOC).
*   **Bilingual Directionality**: Automatic RTL/LTR detection at the section level, ensuring English and Arabic content display with correct alignment regardless of global UI language.
*   **"Zero-Path" Asset Store**: Centralized `papers.json` store with Base64 embedded images and research PDFs for total platform portability.
*   **Cloud Sync Integration**: Fully synchronized with GitHub Gists for real-time content updates through a secure built-in dashboard.

## 🚀 Quick Start (For Developers)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  **Build for production**:
    ```bash
    npm run build
    ```

## 🔐 Admin & Gist Configuration

To enable remote writing and sync for Abdullah:

1.  **Gist Location**: Ensure your data is stored in a file named `papers.json` in your Gist.
2.  **Dashboard Access**: Navigate to `/admin` and log in with your secure password.
3.  **Link your Gist**:
    *   Open **Settings (Gear Icon)**.
    *   Paste your **GitHub Gist ID**.
    *   Paste a **GitHub Personal Access Token (PAT)** with `gist` scope.
4.  **Sync**: Click **Cloud Sync** to synchronize your local edits with the cloud.

## 📂 Architecture
*   `src/data/papers.json`: The "Source of Truth" for all research content.
*   `src/components/PaperModal.tsx`: The primary editorial component (Handles TOC, Direction, and Footnotes).
*   `src/components/Dashboard.tsx`: Secure content management system.
*   `src/utils/gistCache.ts`: 5-minute memory cache to prevent API rate-limiting.

## 📜 License
© 2026 Abdullah Hossam. All Rights Reserved.