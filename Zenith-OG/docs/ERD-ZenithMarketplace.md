# ZENITH STUDENT MARKETPLACE
## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        string id PK "Primary Key (cuid)"
        string email UK "Unique - Student Email"
        string name "Full Name"
        string avatar "Profile Picture URL"
        string phone "Contact Number"
        string university "University/College"
        string location "City/Area"
        datetime createdAt "Account Created"
        datetime updatedAt "Last Updated"
    }

    CATEGORY {
        string id PK "Primary Key (cuid)"
        string name "Category Name"
        string slug UK "Unique Slug"
        string description "Category Description"
        string image "Category Image URL"
        datetime createdAt "Created Date"
        datetime updatedAt "Updated Date"
    }

    PRODUCT {
        string id PK "Primary Key (cuid)"
        string title "Product Title"
        string description "Product Description"
        float price "Price (ZAR)"
        string image "Main Image URL"
        string images "JSON Array of Images"
        string condition "new/used/refurbished"
        string status "active/sold/inactive"
        boolean available "Availability Status"
        string location "Pickup Location"
        string university "Associated University"
        datetime createdAt "Listed Date"
        datetime updatedAt "Last Updated"
        string categoryId FK "Foreign Key to Category"
        string sellerId FK "Foreign Key to User (Seller)"
    }

    CART_ITEM {
        string id PK "Primary Key (cuid)"
        int quantity "Quantity in Cart"
        datetime createdAt "Added to Cart"
        datetime updatedAt "Last Updated"
        string userId FK "Foreign Key to User"
        string productId FK "Foreign Key to Product"
    }

    ORDER {
        string id PK "Primary Key (cuid)"
        float total "Total Amount (ZAR)"
        string status "pending/confirmed/shipped/delivered/cancelled"
        float shippingCost "Shipping Cost"
        float tax "Tax Amount"
        datetime createdAt "Order Date"
        datetime updatedAt "Last Updated"
        string userId FK "Foreign Key to User (Buyer)"
        string addressId FK "Foreign Key to Address"
    }

    ORDER_ITEM {
        string id PK "Primary Key (cuid)"
        int quantity "Quantity Ordered"
        float price "Price at Time of Order"
        string orderId FK "Foreign Key to Order"
        string productId FK "Foreign Key to Product"
    }

    ADDRESS {
        string id PK "Primary Key (cuid)"
        string type "shipping/billing"
        string firstName "First Name"
        string lastName "Last Name"
        string company "Company (Optional)"
        string address1 "Street Address"
        string address2 "Apartment/Unit"
        string city "City"
        string state "Province/State"
        string postalCode "Postal Code"
        string country "Country (Default: South Africa)"
        string phone "Contact Number"
        datetime createdAt "Address Created"
        datetime updatedAt "Last Updated"
        string userId FK "Foreign Key to User"
    }

    REVIEW {
        string id PK "Primary Key (cuid)"
        int rating "Star Rating (1-5)"
        string comment "Review Comment"
        datetime createdAt "Review Date"
        datetime updatedAt "Last Updated"
        string userId FK "Foreign Key to User (Reviewer)"
        string productId FK "Foreign Key to Product"
    }

    MESSAGE {
        string id PK "Primary Key (cuid)"
        string content "Message Content"
        boolean read "Read Status"
        datetime createdAt "Message Sent"
        datetime updatedAt "Last Updated"
        string senderId FK "Foreign Key to User (Sender)"
        string receiverId FK "Foreign Key to User (Receiver)"
    }

    %% RELATIONSHIPS
    USER ||--o{ PRODUCT : "sells"
    USER ||--o{ CART_ITEM : "has_in_cart"
    USER ||--o{ ORDER : "places"
    USER ||--o{ ADDRESS : "owns"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ MESSAGE : "receives"

    CATEGORY ||--o{ PRODUCT : "contains"

    PRODUCT ||--o{ CART_ITEM : "added_to"
    PRODUCT ||--o{ ORDER_ITEM : "ordered_as"
    PRODUCT ||--o{ REVIEW : "reviewed_in"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER }o--|| ADDRESS : "shipped_to"

    %% BUSINESS RULES ANNOTATIONS
    USER ||--|| USER : "Student Verification Required"
    PRODUCT ||--|| PRODUCT : "South African Universities Focus"
    ORDER ||--|| ORDER : "Escrow Payment System"
    MESSAGE ||--|| MESSAGE : "Secure Communication"
```

## Key Relationships & Business Rules:

### 🔗 **Primary Relationships:**
- **User (Seller) → Products**: One-to-Many (A user can sell multiple products)
- **User (Buyer) → Orders**: One-to-Many (A user can place multiple orders)
- **Category → Products**: One-to-Many (A category contains multiple products)
- **Order → OrderItems**: One-to-Many (An order contains multiple items)
- **Product → Reviews**: One-to-Many (A product can have multiple reviews)

### 🎓 **Business Rules:**
1. **Student Verification**: Users must verify with university email
2. **South African Focus**: Designed for SA universities and colleges
3. **Escrow System**: Secure payment holding until delivery confirmation
4. **Location-Based**: Products tagged with university/city for local pickup
5. **Multi-Category**: Textbooks, Electronics, Study Notes, Tutoring Services

### 📊 **Data Integrity:**
- **Unique Constraints**: User email, Category slug, User-Product cart combination, User-Product review combination
- **Default Values**: Order status (pending), Product status (active), Country (South Africa)
- **Cascading**: Related data maintained through foreign key relationships
- **Timestamps**: Automatic creation and update tracking on all entities