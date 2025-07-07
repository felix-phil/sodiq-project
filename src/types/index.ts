export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  image?: string;
  role: "student" | "lecturer" | "admin";
  enrolledCourseIds?: string[];
  teachingCourseIds?: string[];
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  creditUnits: number;
  lecturerId: string;
  level: number;
}
export interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  type: "lab" | "lecture_hall" | "seminar_room";
}

export interface Schedule {
  id: string;
  courseId: string;
  venueId: string;
  lecturerId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleFullDetails extends Schedule {
  course: Course;
  venue: Venue;
  lecturer: AppUser;
}
