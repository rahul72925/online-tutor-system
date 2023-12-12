CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA "onlineTutorSystem";

CREATE TABLE "onlineTutorSystem".students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    phone_number TEXT UNIQUE
);

CREATE TABLE "onlineTutorSystem".tutors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    phone_number TEXT UNIQUE,
    password TEXT
);

CREATE TABLE "onlineTutorSystem".classrooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES "onlineTutorSystem".tutors(id),
    name TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT false
);

CREATE TABLE "onlineTutorSystem".classrooms_students (
    classroom_id UUID REFERENCES "onlineTutorSystem".classrooms(id),
    student_id UUID REFERENCES "onlineTutorSystem".students(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (classroom_id, student_id)
);

CREATE TABLE "onlineTutorSystem".files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES "onlineTutorSystem".tutors(id),
    classroom_id UUID REFERENCES "onlineTutorSystem".classrooms(id),
    file_name TEXT,
    file_type TEXT,
    file_path INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT false
);
