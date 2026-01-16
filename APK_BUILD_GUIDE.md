# Build APK for Bojonegoro Water Springs - Step by Step Guide

## ✅ COMPLETED STEPS:

1. ✅ Installed Capacitor Core & CLI
2. ✅ Initialized Capacitor project (`capacitor.config.ts`)
3. ✅ Added Android platform (`/android` folder created)
4. ✅ Built production files (`/dist` folder optimized)
5. ✅ Synced web assets to Android project

## 📋 NEXT STEPS - Generate Signed APK via Android Studio:

### **STEP 1: Wait for Android Studio to Open**

Android Studio adalah GUI tool yang akan memandu Anda untuk signing APK.

**Expected to see:**
- Android Studio dengan project "bojonegoro-water-springs-dashboard" loaded
- Project structure pada left panel
- Build menu di top navigation

---

### **STEP 2: Create Signing Key (In Android Studio)**

**Path:** `Build` → `Generate Signed Bundle / APK`

**Follow these steps:**

1. **Select Module:** Choose `app` (bukan library)

2. **Choose APK or Bundle:**
   - ✅ Select **APK** (not Bundle)
   - Click **Next**

3. **Create New Keystore (Key Store Path Screen):**
   - Click **Create new...** button

4. **New Key Store Dialog:**
   ```
   Key Store Path: Browse → Create file "bojonegoro-water-springs.jks"
   Password: bojonegoro123
   Confirm Password: bojonegoro123
   OK
   ```

5. **Key (Alias Screen):**
   ```
   Alias: bojonegoro
   Password: bojonegoro123
   Confirm Password: bojonegoro123
   
   Validity (years): 36500 (≈100 years)
   
   Certificate:
   - First and Last Name: Bojonegoro Water Springs
   - Organizational Unit: Development
   - Organization: Local
   - City or Locality: Bojonegoro
   - State or Province: Jawa Timur
   - Country Code: ID
   
   Click OK
   ```

6. **Build Variant Screen:**
   - Release: ✅ (selected)
   - Next

7. **Finish:**
   - APK akan build secara otomatis
   - Tunggu sampai selesai (~3-5 menit)

---

### **STEP 3: Find Generated APK**

After build complete, APK akan berada di:

```
/Users/jokopurwanto/Documents/bojonegoro-water-springs-dashboard (1)/android/app/release/app-release.apk
```

---

### **STEP 4: Verify APK Size & Details**

```bash
cd "/Users/jokopurwanto/Documents/bojonegoro-water-springs-dashboard (1)"
ls -lh android/app/release/app-release.apk
```

Expected size: **10-30 MB**

---

### **STEP 5: Testing APK (Optional)**

Di Android Studio:
1. **Build** → **Select Build Variant**
2. Choose **release**
3. **Run** button (Play icon) atau **Shift+F10**
4. Select emulator atau device
5. APK akan install & launch otomatis

---

### **STEP 6: Rename APK (Optional)**

```bash
cd "/Users/jokopurwanto/Documents/bojonegoro-water-springs-dashboard (1)"

# Rename untuk clarity
cp android/app/release/app-release.apk "Bojonegoro-Water-Springs-v1.0.apk"
```

---

## 📦 DISTRIBUTE APK

Setelah APK berhasil dibuild, Anda bisa:

### **Option A: GitHub Releases**
```bash
# Create release di GitHub
# Upload: Bojonegoro-Water-Springs-v1.0.apk
# Share: https://github.com/jokobaik-cyber/bojonegoro-water-springs-dashboard/releases
```

### **Option B: Google Drive**
```
# Drag & drop APK ke Google Drive
# Share link dengan setting "Anyone with link can access"
# Share link ke users
```

### **Option C: Direct Download**
```
# Upload ke website/hosting Anda
# Share download link
```

### **Option D: Email / WhatsApp**
```
# Send APK file langsung (max 25MB per Gmail)
# Share via WhatsApp, Telegram, dll
```

---

## 🔐 IMPORTANT - KEEP KEYSTORE SAFE!

**File `.jks` SANGAT PENTING untuk update app di masa depan!**

```bash
# Backup keystore file
cp ~/bojonegoro-water-springs.jks ~/Dropbox/bojonegoro-keystore-backup.jks
# atau simpan di external drive
```

**Jangan sampai hilang! Tanpa ini, tidak bisa release update di Play Store atau app store lain.**

---

## 📝 INSTALLATION INSTRUCTIONS FOR USERS

Setelah users download APK:

1. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources (ON)

2. **Download APK** dari link yang Anda share

3. **Tap APK file** → Install

4. **App akan muncul** di home screen dengan nama "Bojonegoro Water Springs"

---

## ❓ TROUBLESHOOTING

**Q: Build failed?**
- Check Android SDK is updated in Android Studio
- Check minimum SDK version (should be 24+)

**Q: Can't find APK?**
- In Android Studio: Build → Analyze APK
- Check if Build Variant is set to "release"

**Q: APK too large?**
- Normal untuk React app dengan Leaflet library
- ~20-30MB is acceptable

---

## 🚀 NEXT TIME YOU UPDATE APP:

```bash
# Make code changes
git add .
git commit -m "Your changes"

# Build & sync
npm run build
npx cap sync android

# In Android Studio:
# Build → Generate Signed Bundle / APK
# (Use existing keystore from ~/bojonegoro-water-springs.jks)
# Build & distribute new version
```

---

## ✅ SUMMARY

✅ React → Capacitor wrapper created
✅ Android native project initialized
✅ Web assets bundled & optimized
✅ Ready to sign & build APK
✅ Now: Use Android Studio GUI to sign & build
✅ Finally: Share APK with users

**Congratulations! You have an Android app! 🎉**
