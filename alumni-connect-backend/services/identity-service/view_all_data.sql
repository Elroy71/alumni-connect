-- SQL Queries untuk melihat semua data di database AlumniConnect
-- Gunakan ini di pgAdmin Query Tool

-- 1. LIHAT SEMUA USERS
SELECT * FROM identity_schema.users;

-- 2. LIHAT SEMUA PROFILES
SELECT * FROM identity_schema.profiles;

-- 3. LIHAT SEMUA CATEGORIES
SELECT * FROM identity_schema.categories;

-- 4. LIHAT SEMUA COMPANIES
SELECT * FROM identity_schema."Company";

-- 5. LIHAT SEMUA JOBS
SELECT * FROM identity_schema."Job";

-- 6. LIHAT SEMUA POSTS
SELECT * FROM identity_schema.posts;

-- 7. LIHAT SEMUA EVENTS
SELECT * FROM identity_schema."Event";

-- 8. LIHAT JOBS DENGAN DETAIL COMPANY
SELECT 
    j.title,
    j.type,
    j.level,
    j.location,
    j."salaryMin",
    j."salaryMax",
    c.name as company_name,
    c.industry
FROM identity_schema."Job" j
LEFT JOIN identity_schema."Company" c ON j."companyId" = c.id;

-- 9. LIHAT POSTS DENGAN DETAIL USER DAN CATEGORY
SELECT 
    p.title,
    p.excerpt,
    p.views,
    u.email as author_email,
    prof."fullName" as author_name,
    cat.name as category_name
FROM identity_schema.posts p
LEFT JOIN identity_schema.users u ON p."userId" = u.id
LEFT JOIN identity_schema.profiles prof ON u.id = prof."userId"
LEFT JOIN identity_schema.categories cat ON p."categoryId" = cat.id;

-- 10. COUNT SEMUA DATA
SELECT 
    (SELECT COUNT(*) FROM identity_schema.users) as total_users,
    (SELECT COUNT(*) FROM identity_schema.categories) as total_categories,
    (SELECT COUNT(*) FROM identity_schema."Company") as total_companies,
    (SELECT COUNT(*) FROM identity_schema."Job") as total_jobs,
    (SELECT COUNT(*) FROM identity_schema.posts) as total_posts,
    (SELECT COUNT(*) FROM identity_schema."Event") as total_events;
