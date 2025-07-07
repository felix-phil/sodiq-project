// firebase/ScheduleModel.ts

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import app from "../../firebase";
import { Schedule, ScheduleFullDetails } from "@/types";

const db = getFirestore(app);
const schedulesRef = collection(db, "schedules");
const coursesRef = collection(db, "courses");
const venuesRef = collection(db, "venues");
const usersRef = collection(db, "users");

export class ScheduleModel {
  // ✅ Create new schedule
  static async createSchedule(data: {
    courseId: string;
    venueId: string;
    lecturerId: string;
    dayOfWeek: string; // e.g. Monday
    startTime: string; // e.g. 09:00
    endTime: string; // e.g. 11:00
  }) {
    // Validate course
    const courseSnap = await getDoc(doc(coursesRef, data.courseId));
    if (!courseSnap.exists()) throw new Error("Course not found");

    // Validate venue
    const venueSnap = await getDoc(doc(venuesRef, data.venueId));
    if (!venueSnap.exists()) throw new Error("Venue not found");

    // Validate lecturer
    const lecturerSnap = await getDoc(doc(usersRef, data.lecturerId));
    if (!lecturerSnap.exists()) throw new Error("Lecturer not found");
    const lecturerData = lecturerSnap.data();
    if (lecturerData.role !== "lecturer")
      throw new Error("User is not a lecturer");

    // Check conflicts (venue)
    const venueQ = query(
      schedulesRef,
      where("dayOfWeek", "==", data.dayOfWeek),
      where("venueId", "==", data.venueId)
    );
    const venueConflicts = await getDocs(venueQ);
    venueConflicts.forEach((snap) => {
      const sched = snap.data();
      if (data.startTime < sched.endTime && data.endTime > sched.startTime) {
        throw new Error("Venue conflict at that time.");
      }
    });

    // Check conflicts (lecturer)
    const lecturerQ = query(
      schedulesRef,
      where("dayOfWeek", "==", data.dayOfWeek),
      where("lecturerId", "==", data.lecturerId)
    );
    const lecturerConflicts = await getDocs(lecturerQ);
    lecturerConflicts.forEach((snap) => {
      const sched = snap.data();
      if (data.startTime < sched.endTime && data.endTime > sched.startTime) {
        throw new Error("Lecturer conflict at that time.");
      }
    });

    const docRef = await addDoc(schedulesRef, data);
    return docRef.id;
  }

  // ✅ Get all
  static async getAllSchedules() {
    const snapshot = await getDocs(schedulesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  }
  static async getAllSchedulesWithDetails() {
    const snapshot = await getDocs(schedulesRef);
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];

    const detailedSchedules = await Promise.all(
      schedules.map(async (sched) => {
        const [courseSnap, venueSnap, lecturerSnap] = await Promise.all([
          getDoc(doc(coursesRef, sched.courseId)),
          getDoc(doc(venuesRef, sched.venueId)),
          getDoc(doc(usersRef, sched.lecturerId)),
        ]);

        return {
          ...sched,
          course: courseSnap.exists()
            ? { id: courseSnap.id, ...courseSnap.data() }
            : null,
          venue: venueSnap.exists()
            ? { id: venueSnap.id, ...venueSnap.data() }
            : null,
          lecturer: lecturerSnap.exists()
            ? { id: lecturerSnap.id, ...lecturerSnap.data() }
            : null,
        };
      })
    ) as ScheduleFullDetails[];

    return detailedSchedules;
  }
  static async getSchedulesByLecturerWithDetails(lecturerId: string) {
    const q = query(schedulesRef, where("lecturerId", "==", lecturerId));
    const snap = await getDocs(q);
    const schedules = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];

    const detailedSchedules = await Promise.all(
      schedules.map(async (sched) => {
        const [courseSnap, venueSnap, lecturerSnap] = await Promise.all([
          getDoc(doc(coursesRef, sched.courseId)),
          getDoc(doc(venuesRef, sched.venueId)),
          getDoc(doc(usersRef, sched.lecturerId)),
        ]);

        return {
          ...sched,
          course: courseSnap.exists()
            ? { id: courseSnap.id, ...courseSnap.data() }
            : null,
          venue: venueSnap.exists()
            ? { id: venueSnap.id, ...venueSnap.data() }
            : null,
          lecturer: lecturerSnap.exists()
            ? { id: lecturerSnap.id, ...lecturerSnap.data() }
            : null,
        };
      })
    ) as ScheduleFullDetails[];

    return detailedSchedules;
  }
  static async getSchedulesByStudentWithDetails(studentId: string) {
    const userSnap = await getDoc(doc(usersRef, studentId));
    if (!userSnap.exists()) throw new Error("Student not found");

    const userData = userSnap.data();
    const enrolledCourseIds = userData.enrolledCourseIds || [];

    if (enrolledCourseIds.length === 0) return [];

    const q = query(schedulesRef, where("courseId", "in", enrolledCourseIds));
    const snap = await getDocs(q);
    const schedules = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];

    const detailedSchedules = await Promise.all(
      schedules.map(async (sched) => {
        const [courseSnap, venueSnap, lecturerSnap] = await Promise.all([
          getDoc(doc(coursesRef, sched.courseId)),
          getDoc(doc(venuesRef, sched.venueId)),
          getDoc(doc(usersRef, sched.lecturerId)),
        ]);

        return {
          ...sched,
          course: courseSnap.exists()
            ? { id: courseSnap.id, ...courseSnap.data() }
            : null,
          venue: venueSnap.exists()
            ? { id: venueSnap.id, ...venueSnap.data() }
            : null,
          lecturer: lecturerSnap.exists()
            ? { id: lecturerSnap.id, ...lecturerSnap.data() }
            : null,
        };
      })
    ) as ScheduleFullDetails[];

    return detailedSchedules;
  }
  // ✅ Get by course
  static async getSchedulesByCourse(courseId: string) {
    const q = query(schedulesRef, where("courseId", "==", courseId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  }

  // ✅ Get by lecturer
  static async getSchedulesByLecturer(lecturerId: string) {
    const q = query(schedulesRef, where("lecturerId", "==", lecturerId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  }

  // ✅ Get by student
  static async getSchedulesByStudent(studentId: string) {
    const userSnap = await getDoc(doc(usersRef, studentId));
    if (!userSnap.exists()) throw new Error("Student not found");

    const userData = userSnap.data();
    const enrolledCourseIds = userData.enrolledCourseIds || [];

    if (enrolledCourseIds.length === 0) return [];

    const q = query(schedulesRef, where("courseId", "in", enrolledCourseIds));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  }

  // ✅ Get by venue
  static async getSchedulesByVenue(venueId: string) {
    const q = query(schedulesRef, where("venueId", "==", venueId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  }

  static async updateSchedule(
    scheduleId: string,
    updates: Partial<{
      courseId: string;
      venueId: string;
      lecturerId: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }>
  ) {
    await updateDoc(doc(schedulesRef, scheduleId), updates);
  }

  static async deleteSchedule(scheduleId: string) {
    await deleteDoc(doc(schedulesRef, scheduleId));
  }
}
