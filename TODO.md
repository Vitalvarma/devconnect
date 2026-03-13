# Profile Image Upload Implementation TODO

## Steps (Plan Breakdown)
- [x] Step 1: Create `/api/upload/route.ts` for Cloudinary image upload
- [x] Step 2a: Create `/api/profile/me` for current user data
- [x] Step 2b: Update `src/app/profile/edit/page.tsx` for file upload + preview + current data load
- [x] Step 3: Update `src/app/profile/[id]/page.tsx` to display profile image in Avatar
- [x] Step 4: Test upload and display (run `npm run dev`, go to /profile/edit)
- [ ] Step 5: Verify DB update and profile view refresh

**Notes**: Assumes CLOUDINARY_* env vars set. next-cloudinary handles uploads.
