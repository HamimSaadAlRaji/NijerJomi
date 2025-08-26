#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Pre-Deployment Check Starting...\n");

const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

function runCheck(name, checkFn) {
  try {
    console.log(`⏳ Checking: ${name}...`);
    const result = checkFn();
    if (result.status === "pass") {
      checks.passed.push(name);
      console.log(`✅ ${name}: ${result.message}\n`);
    } else if (result.status === "warn") {
      checks.warnings.push({ name, message: result.message });
      console.log(`⚠️  ${name}: ${result.message}\n`);
    } else {
      checks.failed.push({ name, message: result.message });
      console.log(`❌ ${name}: ${result.message}\n`);
    }
  } catch (error) {
    checks.failed.push({ name, message: error.message });
    console.log(`❌ ${name}: ${error.message}\n`);
  }
}

// Check 1: Build Success
runCheck("Production Build", () => {
  try {
    execSync("npm run build", { stdio: "pipe" });
    return { status: "pass", message: "Build completed successfully" };
  } catch (error) {
    return { status: "fail", message: `Build failed: ${error.message}` };
  }
});

// Check 2: Environment Variables
runCheck("Environment Configuration", () => {
  const requiredEnvVars = [
    // Add your required environment variables here
    // 'VITE_API_URL',
    // 'VITE_CONTRACT_ADDRESS'
  ];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    return {
      status: "warn",
      message: `Missing env vars: ${missing.join(", ")}`,
    };
  }

  return {
    status: "pass",
    message: "All required environment variables are set",
  };
});

// Check 3: Bundle Size Analysis
runCheck("Bundle Size Analysis", () => {
  const distPath = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distPath)) {
    return { status: "fail", message: "Dist folder not found" };
  }

  const files = fs.readdirSync(path.join(distPath, "assets"));
  const jsFiles = files.filter((f) => f.endsWith(".js"));
  const cssFiles = files.filter((f) => f.endsWith(".css"));

  let totalSize = 0;
  let largeFiles = [];

  [...jsFiles, ...cssFiles].forEach((file) => {
    const filePath = path.join(distPath, "assets", file);
    const size = fs.statSync(filePath).size;
    totalSize += size;

    // Flag files larger than 500KB
    if (size > 500 * 1024) {
      largeFiles.push({ file, size: Math.round(size / 1024) + "KB" });
    }
  });

  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

  if (largeFiles.length > 0) {
    return {
      status: "warn",
      message: `Total bundle: ${totalMB}MB. Large files detected: ${largeFiles
        .map((f) => `${f.file} (${f.size})`)
        .join(", ")}`,
    };
  }

  return { status: "pass", message: `Bundle size: ${totalMB}MB` };
});

// Check 4: Critical Files Exist
runCheck("Critical Files Check", () => {
  const criticalFiles = [
    "dist/index.html",
    "dist/assets",
    "package.json",
    "src/main.tsx",
    "src/App.tsx",
  ];

  const missing = criticalFiles.filter(
    (file) => !fs.existsSync(path.join(__dirname, "..", file))
  );

  if (missing.length > 0) {
    return { status: "fail", message: `Missing files: ${missing.join(", ")}` };
  }

  return { status: "pass", message: "All critical files present" };
});

// Check 5: Package.json Validation
runCheck("Package Configuration", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
  );

  const issues = [];

  if (!packageJson.name) issues.push("Missing name");
  if (!packageJson.version) issues.push("Missing version");
  if (!packageJson.scripts || !packageJson.scripts.build)
    issues.push("Missing build script");

  if (issues.length > 0) {
    return {
      status: "fail",
      message: `Package.json issues: ${issues.join(", ")}`,
    };
  }

  return { status: "pass", message: "Package.json is valid" };
});

// Check 6: TypeScript Compilation
runCheck("TypeScript Check", () => {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return { status: "pass", message: "TypeScript compilation successful" };
  } catch (error) {
    return { status: "fail", message: "TypeScript errors found" };
  }
});

// Check 7: Linting
runCheck("Code Quality (Linting)", () => {
  try {
    execSync("npm run lint", { stdio: "pipe" });
    return { status: "pass", message: "Code passes linting checks" };
  } catch (error) {
    return {
      status: "warn",
      message: "Linting issues found - review before deploying",
    };
  }
});

// Summary Report
console.log("\n" + "=".repeat(50));
console.log("📊 PRE-DEPLOYMENT SUMMARY");
console.log("=".repeat(50));

console.log(`✅ Passed: ${checks.passed.length}`);
if (checks.passed.length > 0) {
  checks.passed.forEach((check) => console.log(`   • ${check}`));
}

if (checks.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${checks.warnings.length}`);
  checks.warnings.forEach((warning) =>
    console.log(`   • ${warning.name}: ${warning.message}`)
  );
}

if (checks.failed.length > 0) {
  console.log(`\n❌ Failed: ${checks.failed.length}`);
  checks.failed.forEach((failure) =>
    console.log(`   • ${failure.name}: ${failure.message}`)
  );
}

console.log("\n" + "=".repeat(50));

if (checks.failed.length === 0) {
  console.log("🎉 READY FOR DEPLOYMENT!");
  if (checks.warnings.length > 0) {
    console.log("⚠️  Please review warnings above.");
  }
  process.exit(0);
} else {
  console.log("🚫 NOT READY FOR DEPLOYMENT");
  console.log("Please fix the failed checks above.");
  process.exit(1);
}
