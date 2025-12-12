# crevy-frontend
The official Crevy platform for Foovante-Global

## Requirements
The package manager used during project creation is [pnpm](https://pnpm.io/) version [v10.13.1](https://pnpm.io/installation).

The following minimum requirements are needed to successfully run the project:
- [Node.JS v18.*](https://nodejs.org/en/download)
- [PNPM v10.3.1+](https://pnpm.io/)

## Installtion
- Clone the repository
- Install dependencies:
```bash
pnpm install
```
- Set up lefthook:
```bash
npx lefthook install
```
- Start development server:
```bash
pnpm run dev
```
- Visit http://localhost:3000/ in your browser to view the running application.

## Tools & Technologies
### Stack for development
- [Next.JS v16.0.10](https://nextjs.org/)
- [TailwindCSS v4.1](https://tailwindcss.com/)
- [shadcn](https://ui.shadcn.com/)

### Tooling
- [Next](https://nextjs.org/)
- [BiomeJS](https://biomejs.dev/) is used for code formatting and linting
- [LeftHook](https://lefthook.dev/) is used to manage pre-commit hooks ensuring all staged files are formatted properly before commited. Committing code changes will reveal the following (supposing a single file is staged for changes and it contains some formatting issues):
```ts
// Problem 1: Use of single quotes instead of double quotes
// Problem 2: No semicolon
import React from 'react'
```

```bash
git add .
git commit -m "import React"
```
Will produce:
```bash
🥊 lefthook v2.0.4  hook: pre-commit │
╰──────────────────────────────────────╯
┃  check ❯ 

Checked 1 file in 12ms. Fixed 1 file.

                                      
  ────────────────────────────────────
summary: (done in 1.98 seconds)       
✔️ check (1.97 seconds)
```
**Note**: If the above information is not shown when you commit changes, kindly run the command below to set up `lefthook`:
```bash
npx lefthook install
```
___
**Note: If your development environment is WSL running in Windows (via VS Code), I strongly advice you commit changes using the VS Code integrated terminal due to `UNC` path issues with Windows and WSL. This will break the effect of the pre-commit hook.**
```bash
# The following error is produced when you commit using the VS Code Source Control panel

│ 🥊 lefthook v2.0.11  hook: pre-commit │
╰───────────────────────────────────────╯
┃  check ❯ 

bash: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
'\\wsl.localhost\Ubuntu-24.04\home\martyofmca\work\foovante-global\crevy-frontend'
CMD.EXE was started with the above path as the current directory.
UNC paths are not supported.  Defaulting to Windows directory.
C:\Windows\src\app\page.tsx internalError/io  INTERNAL  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  × The system cannot find the path specified. (os error 3)
  
  ! This diagnostic was derived from an internal Biome error. Potential bug, please reChecked 0 files in 14ms. No fixes applied.port it if nec
essary.
  


                                      
  ────────────────────────────────────
summary: (done in 2.86 seconds)       
✔️ check (2.86 seconds)
```
___

## Important Project Rules
- When importing in a module, kindly use the path aliases defined in the `tsconfig.json` like so:
```ts
import Logout from "../../../../component/ui/Logout"; ❌
import Logout from "@component/ui/Logout"; ✅
```
- You are free to define as many path aliases you need to make the codebase readable.
- Avoid undescriptive packed strings. Use structured data instead
```ts
// Avoid this ❌
const someUserDetails = "firstName=Jake&lastName=Savage&avatar=https://linktoavatar.com&role=admin";
// This is fine ✅
const user = {
  firstName: "Jake",
  lastName: "Savage",
  avatar: "https://linktoavatar.com",
  role: "admin"
};
// This is also fine ✅
const firstName = "Jake";
const lastName = "Savage";
const avatar: "https://linktoavatar.com";
const role = "admin";
```

## Help
Kindly refer to the [Engineering Guide](./ENGINEERING_GUIDE.md) on the best practices to follow for this project.

Thank you and have a great time solving problems!