// firebase/UserModel.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  getFirestore,
} from "firebase/firestore";
import app from "../../firebase";
import { AppUser } from "@/types";
const db = getFirestore(app); // your initialized Firestore instance

const usersRef = collection(db, "users");

export class UserModel {
  // ✅ Get one user
  static async getUser(userId: string) {
    const docSnap = await getDoc(doc(usersRef, userId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // ✅ Get all lecturers
  static async getAllLecturers() {
    return this.getUsersByRole("lecturer");
  }

  // ✅ Get all students
  static async getAllStudents() {
    return this.getUsersByRole("student");
  }

  // ✅ Get all admins
  static async getAllAdmins() {
    return this.getUsersByRole("admin");
  }

  // ✅ Reusable method
  static async getUsersByRole(role: "student" | "lecturer" | "admin") {
    const q = query(usersRef, where("role", "==", role));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AppUser[];
  }

  // ✅ Assign lecturer to a course
  static async assignToTeach(userId: string, courseId: string) {
    const userRef = doc(usersRef, userId);
    await updateDoc(userRef, {
      teachingCourseIds: arrayUnion(courseId),
    });
  }

  // ✅ Enroll student in a course (used if CourseModel doesn't call it)
  static async enrollInCourse(userId: string, courseId: string) {
    const userRef = doc(usersRef, userId);
    await updateDoc(userRef, {
      enrolledCourseIds: arrayUnion(courseId),
    });
  }
  
}