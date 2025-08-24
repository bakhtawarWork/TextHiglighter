import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')
const extensionDir = resolve(rootDir, 'extension')

// Create extension directory if it doesn't exist
if (!existsSync(extensionDir)) {
  mkdirSync(extensionDir, { recursive: true })
}

// Copy manifest.json
copyFileSync(
  resolve(rootDir, 'manifest.json'),
  resolve(extensionDir, 'manifest.json')
)

// Copy built files with correct names
const filesToCopy = [
  { from: 'src/popup/index.html', to: 'popup.html' },
  { from: 'main2.js', to: 'popup.js' },
  { from: 'content.js', to: 'content.js' },
  { from: 'background.js', to: 'background.js' }
]

filesToCopy.forEach(({ from, to }) => {
  const sourcePath = resolve(distDir, from)
  const destPath = resolve(extensionDir, to)
  
  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath)
    console.log(`✓ Copied ${from} to extension/${to}`)
  } else {
    console.warn(`⚠ Warning: ${from} not found in dist/`)
  }
})

// Copy CSS files
const cssFiles = [
  { from: 'main.css', to: 'popup.css' },
  { from: '../src/content/content.css', to: 'content.css' }
]

cssFiles.forEach(({ from, to }) => {
  const sourcePath = resolve(distDir, from)
  const destPath = resolve(extensionDir, to)
  
  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath)
    console.log(`✓ Copied ${from} to extension/${to}`)
  } else {
    console.warn(`⚠ Warning: ${from} not found in dist/`)
  }
})

// Fix the popup.html file references
const popupHtmlPath = resolve(extensionDir, 'popup.html')
if (existsSync(popupHtmlPath)) {
  let popupHtml = readFileSync(popupHtmlPath, 'utf8')
  
  // Replace absolute paths with relative paths
  popupHtml = popupHtml.replace('src="/main2.js"', 'src="popup.js"')
  popupHtml = popupHtml.replace('href="/main.css"', 'href="popup.css"')
  
  writeFileSync(popupHtmlPath, popupHtml)
  console.log('✓ Fixed popup.html file references')
}

// Create icons directory and placeholder icons
const iconsDir = resolve(extensionDir, 'icons')
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true })
}

console.log('\n🎉 Extension built successfully!')
console.log('📁 Extension files are in the "extension/" directory')
console.log('📋 To install in Chrome:')
console.log('   1. Open chrome://extensions/')
console.log('   2. Enable "Developer mode" (toggle in top right)')
console.log('   3. Click "Load unpacked"')
console.log('   4. Select the "extension" folder')
console.log('\n⚠ Note: You may need to create icon files (16x16, 32x32, 48x48, 128x128)')
console.log('   or update the manifest.json to remove icon references')
