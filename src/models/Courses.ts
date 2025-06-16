// firebase/Course.ts
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayUnion,
  getFirestore,
  deleteDoc,
} from "firebase/firestore";
import app from "../../firebase";
import { Course } from "@/types";
const db = getFirestore(app); // make sure this is your initialized firestore

const coursesRef = collection(db, "courses");
const usersRef = collection(db, "users");

export class CourseModel {
  // ✅ Create a new course (with code uniqueness check)
  static async createCourse(data: {
    title: string;
    code: string;
    creditUnits: number;
    lecturerId: string;
    level: number; // e.g. 100, 200
  }) {
    // Check if code already exists
    const codeCheck = query(coursesRef, where("code", "==", data.code));
    const existing = await getDocs(codeCheck);

    if (!existing.empty) {
      throw new Error("Course code already exists.");
    }

    const docRef = await addDoc(coursesRef, data);
    return docRef.id;
  }

  // ✅ Fetch all courses
  static async getAllCourses() {
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
  }

  // ✅ Enroll student in course
  static async enrollStudent(studentId: string, courseId: string) {
    const userRef = doc(db, "users", studentId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("Student not found");

    const userData = userSnap.data();
    if (userData.role !== "student") throw new Error("User is not a student");

    await updateDoc(userRef, {
      enrolledCourseIds: arrayUnion(courseId),
    });
  }

  // ✅ Get all courses a student is enrolled in
  static async getEnrolledCourses(studentId: string) {
    const userSnap = await getDoc(doc(usersRef, studentId));
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const enrolledCourseIds = userData.enrolledCourseIds || [];

    if (enrolledCourseIds.length === 0) return [];

    const q = query(coursesRef, where("__name__", "in", enrolledCourseIds));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // ✅ Optional: Get all courses for a level
  static async getCoursesByLevel(level: number) {
    const q = query(coursesRef, where("level", "==", level));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  static async deleteCourse(courseId: string) {
    await deleteDoc(doc(db, "courses", courseId));
  }
}