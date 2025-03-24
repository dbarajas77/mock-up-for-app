// Mock data for projects based on the SQL schema
export const projectsData = [
  {
    id: "8f7e6d5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f",
    name: "Boston Harbor Renovation",
    description: "Major renovation of the Boston Harbor waterfront area including new docks, pedestrian walkways, and recreational facilities.",
    status: "active",
    priority: "high",
    start_date: "2023-06-15",
    end_date: "2025-12-30",
    created_by: "5a4b3c2d-1e0f-9g8h-7i6j-5k4l3m2n1o0p",
    created_at: "2023-05-01T10:30:00Z",
    updated_at: "2023-05-01T10:30:00Z"
  },
  {
    id: "7e6d5c4b-3a2c-1d0e-9f8a-7b6c5d4e3f2a",
    name: "Cambridge Tech Campus",
    description: "Development of a new technology campus in Cambridge with 5 buildings, underground parking, and sustainable energy systems.",
    status: "active",
    priority: "medium",
    start_date: "2023-08-01",
    end_date: "2026-03-15",
    created_by: "5a4b3c2d-1e0f-9g8h-7i6j-5k4l3m2n1o0p",
    created_at: "2023-07-10T14:20:00Z",
    updated_at: "2023-07-10T14:20:00Z"
  },
  {
    id: "6d5c4b3a-2c1d-0e9f-8a7b-6c5d4e3f2a1b",
    name: "Quincy Medical Center",
    description: "Construction of a state-of-the-art medical center with specialized departments for cardiology, neurology, and oncology.",
    status: "pending",
    priority: "high",
    start_date: "2023-09-15",
    end_date: "2026-06-30",
    created_by: "5a4b3c2d-1e0f-9g8h-7i6j-5k4l3m2n1o0p",
    created_at: "2023-08-05T09:45:00Z",
    updated_at: "2023-08-05T09:45:00Z"
  },
  {
    id: "5c4b3a2c-1d0e-9f8a-7b6c-5d4e3f2a1b0c",
    name: "Somerville Mixed-Use Development",
    description: "Mixed-use development featuring residential units, retail spaces, and office buildings in Somerville area.",
    status: "active",
    priority: "medium",
    start_date: "2023-10-01",
    end_date: "2026-07-15",
    created_by: "4b3c2d1e-0f9g-8h7i-6j5k-4l3m2n1o0p9",
    created_at: "2023-09-15T11:30:00Z",
    updated_at: "2023-09-15T11:30:00Z"
  },
  {
    id: "4b3a2c1d-0e9f-8a7b-6c5d-4e3f2a1b0c9d",
    name: "Brookline School Renovation",
    description: "Complete renovation of Brookline High School including new classrooms, gymnasium, and science laboratories.",
    status: "completed",
    priority: "medium",
    start_date: "2022-05-01",
    end_date: "2023-08-15",
    created_by: "4b3c2d1e-0f9g-8h7i-6j5k-4l3m2n1o0p9",
    created_at: "2022-04-10T08:15:00Z",
    updated_at: "2023-08-20T16:45:00Z"
  },
  {
    id: "3a2c1d0e-9f8a-7b6c-5d4e-3f2a1b0c9d8e",
    name: "Newton Affordable Housing",
    description: "Construction of 120 affordable housing units in Newton with community spaces and sustainable design features.",
    status: "pending",
    priority: "high",
    start_date: "2023-11-15",
    end_date: "2025-10-30",
    created_by: "3c2d1e0f-9g8h-7i6j-5k4l-3m2n1o0p9q8",
    created_at: "2023-10-20T13:40:00Z",
    updated_at: "2023-10-20T13:40:00Z"
  },
  {
    id: "2c1d0e9f-8a7b-6c5d-4e3f-2a1b0c9d8e7f",
    name: "Waltham Office Park",
    description: "Development of a modern office park with 10 buildings, landscaped grounds, and amenities for tech companies.",
    status: "active",
    priority: "medium",
    start_date: "2023-07-01",
    end_date: "2025-12-15",
    created_by: "3c2d1e0f-9g8h-7i6j-5k4l-3m2n1o0p9q8",
    created_at: "2023-06-15T09:20:00Z",
    updated_at: "2023-06-15T09:20:00Z"
  },
  {
    id: "1d0e9f8a-7b6c-5d4e-3f2a-1b0c9d8e7f6g",
    name: "Medford Bridge Replacement",
    description: "Replacement of the aging Medford Bridge with a new structure designed for increased traffic capacity and pedestrian accessibility.",
    status: "completed",
    priority: "high",
    start_date: "2022-03-15",
    end_date: "2023-09-30",
    created_by: "2d1e0f9g-8h7i-6j5k-4l3m-2n1o0p9q8r7",
    created_at: "2022-02-25T10:15:00Z",
    updated_at: "2023-10-05T14:30:00Z"
  }
];

// Helper function to generate a random UUID (used in create report modal)
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Project members data (if needed for future reference)
export const projectMembersData = [
  {
    project_id: "8f7e6d5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f",
    user_id: "5a4b3c2d-1e0f-9g8h-7i6j-5k4l3m2n1o0p",
    role: "owner",
    joined_at: "2023-05-01T10:30:00Z"
  },
  {
    project_id: "8f7e6d5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f",
    user_id: "4b3c2d1e-0f9g-8h7i-6j5k-4l3m2n1o0p9",
    role: "member",
    joined_at: "2023-05-02T14:45:00Z"
  }
]; 