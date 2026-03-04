# EventFinder - Quick Reference Card

## 🚀 QUICK START
```bash
# Terminal 1 - Backend
cd backend
node insert-dummy-data.js  # Optional: Reload test data
npm start                   # Already running on :5000

# Terminal 2 - Frontend  
cd frontend
npm run dev                 # Already running on :5173
```

## 🌐 ACCESS POINTS
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Database**: mongodb://127.0.0.1:27017/eventfinder

---

## 🔑 TEST CREDENTIALS (All Password: `admin123`)

```
ADMIN USER
└─ Email: admin@example.com
   Password: admin123
   Role: admin
   Access: Full control panel

VERIFIED ORGANIZER (CAN CREATE EVENTS NOW)
└─ Email: musicfest@example.com
   Password: admin123
   Role: organizer
   Status: ✅ Verified
   Access: Create events immediately

PENDING ORGANIZER (AWAITS APPROVAL)
└─ Email: organizer1@example.com
   Password: admin123
   Role: organizer
   Status: ⏳ Pending
   Access: Cannot create events yet

REGULAR USERS
├─ john@example.com / admin123
└─ jane@example.com / admin123
   Role: user
   Access: Discover events, RSVP, apply as organizer
```

---

## 📄 FEATURES MATRIX

| Feature | User | Org* | Admin |
|---------|------|------|-------|
| Login | ✅ | ✅ | ✅ |
| View Events | ✅ | ✅ | ✅ |
| RSVP Events | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ |
| Edit Own Events | - | ✅ | ✅ |
| Apply as Org | ✅ | - | - |
| Approve Orgs | ❌ | ❌ | ✅ |
| Approve Events | ❌ | ❌ | ✅ |

*Org = Verified Organizer

---

## 🎯 MAIN WORKFLOWS

### Test 1: User Discovers & RSVPs Event (2 min)
1. Go to http://localhost:5173
2. Click "All Events"
3. Login → john@example.com / admin123
4. Click "RSVP Now"
5. See "✓ Going" button

### Test 2: Organizer Creates Event (5 min)
1. Login: musicfest@example.com / admin123
2. Click "Create Event"
3. Fill form (Title, Description, Date, Location, Category)
4. Submit
5. (Event appears in pending queue)

### Test 3: Admin Approves Event (2 min)
1. Login: admin@example.com / admin123
2. Go to Dashboard → Admin Control Panel
3. Find event in "Event Approval Queue"
4. Click "Approve"
5. (Event now visible in /events search)

### Test 4: New Organizer Gets Approval (3 min)
1. Sign up as Organizer (www.example.com)
2. See "Account Pending Verification"
3. As admin: Dashboard → Find in queue → "Approve Profile"
4. Logout, login as organizer
5. "Create New Event" button now appears

---

## 🔌 CRITICAL API ENDPOINTS

```
LOGIN
POST /api/auth/login
Body: { email, password }
Response: { token, user, role, isVerified }

CREATE EVENT
POST /api/events
Headers: Authorization: Bearer <token>
Body: { title, description, date, category, location }

GET APPROVED EVENTS
GET /api/events?category=Music&distance=5&lat=40.7&lng=-73.9
Response: { data: [...], count: N }

ADMIN: APPROVE EVENT
PUT /api/admin/events/:id/approve
Headers: Authorization: Bearer <admin_token>

ADMIN: GET PENDING ORGANIZERS
GET /api/admin/organizers/pending
Headers: Authorization: Bearer <admin_token>
```

---

## 🛠️ FILE CHANGES MADE

**Backend**
- ✅ Event Model: Added `status` field (pending/approved/rejected)
- ✅ Admin Controller: Added event approval functions
- ✅ Admin Routes: Added event approval endpoints
- ✅ Event Controller: Filter to show only approved events

**Frontend**
- ✅ Created: EventsList.jsx (Comprehensive event browsing page)
- ✅ Updated: Home.jsx (Fetch real events instead of dummy data)
- ✅ Updated: Header.jsx (Fixed: Hide "Create Event" from non-logged users)
- ✅ Updated: App.jsx (Added /events route)
- ✅ Updated: Admin Dashboard (Shows pending event queue with approve/reject)

**Configuration**
- ✅ Created: insert-dummy-data.js (Easy test data loading)
- ✅ Created: IMPLEMENTATION_GUIDE.md (Full documentation)
- ✅ Created: SYSTEM_STATUS.md (Feature status report)

---

## 🎨 PAGE ROUTES

```
/               → Home (Event Discovery + Map)
/events         → All Events Listing
/login          → Login Form
/register       → Registration Form
/create-event   → Create New Event
/dashboard      → User Dashboard
/organizer      → Organizer Dashboard
/admin          → Admin Control Panel
/organizer-request → Apply to be Organizer
```

---

## 📍 LOCATION TESTING

**Pre-loaded Event Locations**
- Central Park Amphitheater: lat=40.7829, lng=-73.9654
- Riverside Garden Venue: lat=40.7614, lng=-73.9776
- Downtown Arena: lat=40.7505, lng=-73.9934

Use these coordinates when:
- Testing event creation form
- Manual location input in "Create Event"

---

## ⚠️ COMMON ISSUES & FIXES

| Issue | Solution |
|-------|----------|
| "Account Pending Verification" | Login as admin, approve organizer |
| Event doesn't appear in search | Admin must approve event first |
| "Create Event" button not showing | Must be verified organizer |
| Cannot RSVP | Must be logged in |
| 401 "Not authorized" | JWT token expired or invalid |
| Location required error | Pick coordinates on map or enter manually |

---

## 🔐 SECURITY

- ✅ Passwords: bcryptjs hashed (10 rounds)
- ✅ Tokens: JWT with expiration
- ✅ Authorization: Role-based middleware
- ✅ CORS: Enabled for frontend
- ✅ Validation: Backend input validation

---

## 📦 DEPLOYMENT CHECKLIST

- [ ] All test accounts working
- [ ] Event approval workflow tested
- [ ] Organizer approval workflow tested  
- [ ] RSVP functionality tested
- [ ] Search/filter working
- [ ] Admin dashboard functional
- [ ] No console errors
- [ ] All routes accessible
- [ ] Database connected
- [ ] Environment variables set

---

## 🎯 NEXT STEPS (Optional Enhancements)

1. **Email Notifications**: Send email when organizer/event approved
2. **Image Uploads**: Add event cover images
3. **Reviews**: Add ratings/reviews for events
4. **Social Sharing**: Share events to social media
5. **Analytics**: Track popular categories/locations
6. **Payment**: Add ticket purchase system
7. **Search**: Full-text search on event titles/descriptions
8. **Calendar**: iCal export for RSVP'd events

---

**Status**: ✅ All features working  
**Backend Health**: ✅ Running on :5000  
**Frontend Health**: ✅ Running on :5173  
**Database**: ✅ Connected & populated  

Ready to test! 🚀

