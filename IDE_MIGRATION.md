# IDE Migration Guide

This project is **IDE-agnostic** and can be used with any code editor. This guide helps you migrate from Cursor to Antigravity or any other IDE.

## ✅ Project is IDE-Agnostic

The project has been prepared to work with any IDE:

- ✅ No Cursor-specific configurations
- ✅ Standard TypeScript/Next.js setup
- ✅ Standard `.gitignore` (IDE files excluded)
- ✅ No editor-specific dependencies
- ✅ Standard project structure

## 🔄 Migrating to Antigravity (or any IDE)

### 1. Clone/Open Project

```bash
# If cloning fresh
git clone https://github.com/Temuka-F/moova.git
cd moova

# Or just open existing folder in your IDE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment template
cp .env.example .env.local

# Fill in your environment variables (see SETUP.md)
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. IDE-Specific Setup

#### Antigravity / VS Code

The project works out-of-the-box. Recommended extensions:

- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)
- **Prisma** - Prisma syntax highlighting
- **TypeScript** - TypeScript support (built-in)

#### IntelliJ / WebStorm

- Open project as "Node.js" project
- Configure Node.js interpreter
- Enable TypeScript support
- Install Prisma plugin (optional)

### 6. Verify Setup

```bash
# Start dev server
npm run dev

# Should start on http://localhost:3000
```

## 📁 Project Structure

The project follows standard Next.js conventions:

```
moova/
├── src/              # Source code
├── prisma/           # Database schema
├── public/           # Static assets
├── scripts/          # Utility scripts
└── package.json      # Dependencies
```

## 🛠 Development Commands

All commands work the same in any IDE:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npm run seed         # Seed database
```

## 🔧 IDE Configuration Files

The project intentionally avoids IDE-specific configs:

- ❌ No `.vscode/` folder (can be added if needed)
- ❌ No `.idea/` folder (can be added if needed)
- ❌ No Cursor-specific configs
- ✅ Standard `.gitignore` excludes IDE files

## 📝 Code Formatting

The project uses:

- **ESLint** - Configured in `eslint.config.mjs`
- **TypeScript** - Configured in `tsconfig.json`
- **Tailwind CSS** - Configured in `postcss.config.mjs`

You can add Prettier or other formatters if desired, but it's not required.

## 🐛 Troubleshooting

### TypeScript Errors

If you see TypeScript errors:

```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in your IDE
```

### Import Errors

If imports don't resolve:

- Check `tsconfig.json` paths are correct
- Restart IDE
- Run `npm install` again

### ESLint Errors

```bash
# Run ESLint manually
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## ✅ Verification Checklist

After migration, verify:

- [ ] Project opens without errors
- [ ] TypeScript types resolve correctly
- [ ] `npm run dev` starts successfully
- [ ] No IDE-specific errors
- [ ] Can navigate code with "Go to Definition"
- [ ] Auto-completion works
- [ ] ESLint shows in IDE (if extension installed)

## 🎯 Next Steps

1. Open project in your IDE
2. Install recommended extensions
3. Start development server
4. Begin coding!

The project is fully functional in any IDE. No special configuration needed.

---

**Note:** The `.cursor/` directory (if present) is gitignored and won't affect other IDEs. You can safely delete it if migrating away from Cursor.
