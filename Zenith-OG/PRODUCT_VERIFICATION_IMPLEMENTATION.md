# Product Verification System Implementation Plan

## Overview
Implement a complete product verification workflow where:
1. Users submit products for review (status: "pending")
2. Products must be approved by admin before going live
3. Users receive notifications about approval/rejection
4. Admins have a dedicated section to review pending products

## Database Changes ✅ COMPLETED

### Product Model Updates (schema.prisma)
```prisma
status: String @default("pending") // pending, approved, rejected, active, sold, inactive
adminApproved: Boolean @default(false)
approvedBy: String? // Admin ID who approved
approvedAt: DateTime?
rejectionReason: String?
verificationNotes: String?
```

## Implementation Steps

### 1. Admin Product Verification Page
**File**: `app/admin/products/page.tsx`
- List all pending products
- Show product details, images, seller info
- Approve/Reject buttons
- Add rejection reason field
- Display verification notes

### 2. API Endpoints

#### GET `/api/admin/products`
- Fetch products with filters (pending, approved, rejected)
- Include seller information
- Pagination support

#### PUT `/api/admin/products/[id]/verify`
- Approve product (set status to "approved", adminApproved = true)
- Reject product (set status to "rejected", add rejectionReason)
- Create notification for seller
- Return updated product

### 3. Product Creation Updates
**File**: Update product creation endpoint
- Set initial status to "pending"
- Show message to user: "Your product has been submitted for review"
- Create notification record

### 4. Notifications System

#### User Notifications
**Approval Notification**:
```
✓ Product Approved!
Your listing "{product.title}" has been approved and is now live on Zenith.
```

**Rejection Notification**:
```
✗ Product Not Approved
Your listing "{product.title}" was not approved.
Reason: {rejectionReason}
```

### 5. Frontend Updates

#### Product Submission Form
- Add notice: "All products must be approved before listing"
- Show submission confirmation
- Redirect to "My Products" with pending status indicator

#### User Dashboard
- Show pending products count
- Display approval status for each product
- Show rejection reason if applicable

## Files to Create/Modify

### New Files
1. `app/admin/products/page.tsx` - Admin product verification page
2. `app/api/admin/products/route.ts` - List products with filters  
3. `app/api/admin/products/[id]/verify/route.ts` - Approve/Reject endpoint

### Modified Files
1. `app/api/products/route.ts` - Update POST to set status="pending"
2. `app/sell/page.tsx` - Add verification notice
3. `prisma/schema.prisma` - ✅ Already updated

## Workflow

### User Flow:
1. User creates product listing
2. Product saved with status="pending"
3. User sees: "Submitted for review"
4. User waits for admin approval

### Admin Flow:
1. Admin sees notification of pending products
2. Admin navigates to Products verification section
3. Admin reviews product details, images, description
4. Admin clicks "Approve" or "Reject"
5. If rejecting, admin enters reason
6. System creates notification for user

### User Notification Flow:
1. User receives notification
2. If approved: Product goes live
3. If rejected: User sees reason, can resubmit

## Admin Portal Navigation Update
Add "Product Verifications" to admin sidebar
Show pending count badge

## Status Flow
```
pending → approved → active (user can activate/deactivate)
pending → rejected (user can edit and resubmit)
```
