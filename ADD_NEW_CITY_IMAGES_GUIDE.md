# Guide: Adding 10 New City Images

## Images to Add

You need to add 10 new image files to the `src/assets/destinations/` folder. Here are the exact filenames needed:

### Required Image Files:

1. **trincomalee.jpg** - Trincomalee (Eastern beach city)
2. **jaffna.jpg** - Jaffna (Northern city)
3. **bentota.jpg** - Bentota (Western beach resort)
4. **hikkaduwa.jpg** - Hikkaduwa (Southern beach town)
5. **polonnaruwa.jpg** - Polonnaruwa (Ancient city)
6. **dambulla.jpg** - Dambulla (Cave temple area)
7. **arugam-bay.jpg** - Arugam Bay (Surf destination)
8. **unawatuna.jpg** - Unawatuna (Beach town near Galle)
9. **yala.jpg** - Yala (National park/wildlife)
10. **negombo.jpg** - Negombo (Beach city near airport)

## Folder Structure

```
src/
  assets/
    destinations/
      # Existing 8 images:
      colombo.jpg
      kandy.jpg
      galle.jpg
      ella.jpg
      sigiriya.jpg
      nuwara-eliya.jpg
      mirissa.jpg
      anuradhapura.jpg

      # NEW - Add these 10 images:
      trincomalee.jpg      ← ADD THIS
      jaffna.jpg           ← ADD THIS
      bentota.jpg          ← ADD THIS
      hikkaduwa.jpg        ← ADD THIS
      polonnaruwa.jpg      ← ADD THIS
      dambulla.jpg         ← ADD THIS
      arugam-bay.jpg       ← ADD THIS
      unawatuna.jpg        ← ADD THIS
      yala.jpg             ← ADD THIS
      negombo.jpg          ← ADD THIS
```

## Steps to Add Images

### Option 1: Manual Addition

1. Navigate to `src/assets/destinations/` folder
2. Add all 10 image files with exact names as listed above
3. Ensure images are in `.jpg` format
4. Recommended image size: 1200x800px or similar aspect ratio
5. File size: Keep under 500KB per image for optimal loading

### Option 2: Using Terminal (PowerShell)

```powershell
# Navigate to destinations folder
cd src\assets\destinations

# Then copy your images to this folder with correct names
# Example:
# copy C:\Downloads\my-trincomalee-photo.jpg .\trincomalee.jpg
```

## Image Recommendations

### Image Quality:

- **Format**: JPG (preferred) or PNG
- **Resolution**: 1200x800px to 1920x1080px
- **Aspect Ratio**: 16:9 or 3:2 (landscape orientation)
- **File Size**: 200-500KB per image (optimized)
- **Quality**: High quality, vibrant, representative of the location

### What to Show:

- **Trincomalee**: Beach, Koneswaram Temple, or coast view
- **Jaffna**: Nallur Temple, Dutch Fort, or cultural landmarks
- **Bentota**: Beach resort, water sports, or river view
- **Hikkaduwa**: Beach, coral reef, or surfing scene
- **Polonnaruwa**: Ancient ruins, Buddha statues, or historical site
- **Dambulla**: Cave temple, golden Buddha, or rock temple
- **Arugam Bay**: Surf beach, bay view, or coastal scenery
- **Unawatuna**: Beach, palm trees, or bay view
- **Yala**: Wildlife (leopards, elephants), safari jeeps, or park landscape
- **Negombo**: Beach, fishing boats, or lagoon

## Code Changes Already Made ✅

The following files have been updated to support 18 images:

1. ✅ **imageUtils.js**
   - Added 10 new import statements
   - Updated `cityImagesMap` with new cities
   - Updated `getCityImageUrl()` to use all 18 images
   - Updated `getRandomCityImage()` to use all 18 images

## After Adding Images

### Testing:

1. Restart your development server (if running)
2. Clear browser cache (Ctrl+F5)
3. Navigate to My Trips page
4. Check that trip cards show diverse images
5. Verify no broken image icons appear

### Verification:

```bash
# Check if all images exist
ls src/assets/destinations/
```

You should see **18 total images**:

- 8 original images
- 10 new images

## Troubleshooting

### If images don't load:

1. **Check filename spelling** - Must match exactly (case-sensitive)
2. **Check file extension** - Must be `.jpg` (not `.jpeg`, `.JPG`, or `.png`)
3. **Restart dev server** - `npm start` or refresh
4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)

### If build fails:

1. Check import paths in `imageUtils.js`
2. Ensure all 10 files exist in the correct folder
3. Run `npm run build` to see specific errors

## Expected Result

After adding all images:

- ✅ Trip cards will have **18 different** possible images (increased from 8)
- ✅ More visual variety across the My Trips page
- ✅ Better representation of Sri Lankan destinations
- ✅ Smoother user experience with diverse imagery

## City Coverage

### Now Covered (18 cities):

1. Colombo (Western coast, capital)
2. Kandy (Central, cultural capital)
3. Galle (Southern fort city)
4. Ella (Hill country, scenic)
5. Sigiriya (Rock fortress)
6. Nuwara Eliya (Hill station, tea country)
7. Mirissa (Southern beach, whale watching)
8. Anuradhapura (Ancient capital)
9. **Trincomalee (Eastern beaches)** ← NEW
10. **Jaffna (Northern peninsula)** ← NEW
11. **Bentota (Beach resort)** ← NEW
12. **Hikkaduwa (Beach & surfing)** ← NEW
13. **Polonnaruwa (Ancient city)** ← NEW
14. **Dambulla (Cave temples)** ← NEW
15. **Arugam Bay (Surf destination)** ← NEW
16. **Unawatuna (Beach town)** ← NEW
17. **Yala (National park)** ← NEW
18. **Negombo (Airport beach city)** ← NEW

## Notes

- Images are cached in browser, so users might need to clear cache to see new images
- If you don't have all 10 images immediately, the code will still work with the 8 original images
- Add images gradually if needed - the code won't break if some are missing
- Each new image added increases visual variety for trip cards

---

**Need Help Finding Images?**

- Use royalty-free sources: Unsplash, Pexels, Pixabay
- Search terms: "[City Name] Sri Lanka tourism"
- Ensure you have rights to use the images
- Optimize images before adding (use tools like TinyPNG)
