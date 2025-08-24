# 🔍 Chrome Extension Debugging Guide

## 🚀 Quick Debug Steps

### Step 1: Reload Extension
1. Go to `chrome://extensions/`
2. Find "Text Highlighter"
3. Click the **refresh button** (🔄)

### Step 2: Check Console
1. Open any webpage
2. Press **F12** → **Console** tab
3. Look for these messages:
   ```
   Text Highlighter content script initialized
   Chrome storage available: true
   Chrome runtime available: true
   ```

### Step 3: Test Selection
1. Select some text on the page
2. Watch console for detailed logs
3. Should see popup appear

## 🔧 Debug Commands

### Run in Page Console:
```javascript
// Quick debug info
debugTextHighlighter();

// Check extension status
console.log('Extension instance:', !!window.textHighlighterInstance);

// Check storage
chrome.storage.local.get(['highlights'], (result) => {
    console.log('Highlights:', result.highlights);
});

// Test selection
const sel = window.getSelection();
console.log('Selected text:', sel.toString());
```

## 🚨 Common Issues & Solutions

### Issue: "Extension not loading"
**Symptoms**: No console messages
**Solution**:
1. Check `chrome://extensions/` for errors
2. Make sure extension is enabled
3. Reload the extension
4. Try a different webpage

### Issue: "Multiple popups"
**Symptoms**: Popup appears multiple times
**Debug**:
```javascript
// Check for duplicate instances
console.log('Popup count:', document.querySelectorAll('#text-highlighter-popup').length);
```
**Solution**: Reload extension

### Issue: "No success message"
**Symptoms**: Save works but no green message
**Debug**:
```javascript
// Check if messages are being created
console.log('Success messages:', document.querySelectorAll('#text-highlighter-success').length);
```

### Issue: "Storage not working"
**Symptoms**: Highlights not saving
**Debug**:
```javascript
// Test storage directly
chrome.storage.local.set({test: 'hello'}, () => {
    console.log('Storage write complete');
    chrome.storage.local.get(['test'], (result) => {
        console.log('Storage read result:', result.test);
    });
});
```

### Issue: "Popup (extension icon) blank"
**Symptoms**: White/empty popup when clicking extension
**Solution**:
1. Right-click extension icon → "Inspect popup"
2. Check Console for React errors
3. Verify files are loading correctly

## 📋 Debug Checklist

### ✅ Extension Installation
- [ ] Extension appears in `chrome://extensions/`
- [ ] Extension is enabled (blue toggle)
- [ ] No error messages in extension list
- [ ] Developer mode is enabled

### ✅ Content Script
- [ ] Console shows: "Text Highlighter content script initialized"
- [ ] Console shows: "Chrome storage available: true"
- [ ] `debugTextHighlighter()` function works
- [ ] Text selection triggers console logs

### ✅ Popup Functionality
- [ ] Selecting text shows popup
- [ ] Popup has "Save" and "Cancel" buttons
- [ ] Only one popup appears per selection
- [ ] Popup disappears after 5 seconds

### ✅ Saving Functionality
- [ ] Clicking "Save" shows console: "Saving highlight"
- [ ] Console shows: "Highlight saved successfully"
- [ ] Green success message appears
- [ ] Text gets highlighted with yellow background

### ✅ Extension Popup
- [ ] Clicking extension icon opens popup
- [ ] Popup shows saved highlights
- [ ] Can delete highlights
- [ ] Refresh button works

## 🛠️ Advanced Debugging

### Check Background Script
1. Go to `chrome://extensions/`
2. Click "service worker" or "background page"
3. Check console for errors

### Check Manifest Permissions
```javascript
// Check permissions
chrome.permissions.getAll((permissions) => {
    console.log('Permissions:', permissions);
});
```

### Force Storage Clear
```javascript
// Clear all storage
chrome.storage.local.clear(() => {
    console.log('Storage cleared');
});
```

### Check Network Tab
1. Open DevTools → Network tab
2. Look for failed requests
3. Check if CSS/JS files are loading

## 📞 Getting Help

If issues persist:
1. **Provide console logs** from both page and extension popup
2. **Share browser version** and extension status
3. **Describe exact steps** that lead to the issue
4. **Include error messages** if any appear

## 🔄 Reset Everything

If all else fails:
1. Remove extension completely
2. Clear browser data for testing domain
3. Restart Chrome
4. Reinstall extension
5. Test on fresh incognito window

---

**Remember**: Always check the console first! Most issues show up as error messages or missing log entries.
