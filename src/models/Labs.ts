// firebase/VenueModel.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import app from "../../firebase";
import { getFirestore } from "firebase/firestore";
import { Venue } from "@/types";
const db = getFirestore(app);

const venuesRef = collection(db, "venues");

export class VenueModel {
  // ✅ Create a new venue
  static async createVenue(data: {
    name: string;
    capacity: number;
    location: string;
    type: "lab" | "lecture_hall" | "seminar_room";
  }) {
    const existing = await getDocs(query(venuesRef, where("name", "==", data.name)));
    if (!existing.empty) throw new Error("Venue name already exists");

    const docRef = await addDoc(venuesRef, data);
    return docRef.id;
  }

  // ✅ Get all venues
  static async getAllVenues() {
    const snapshot = await getDocs(venuesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Venue[];
  }

  // ✅ Get venue by ID
  static async getVenue(venueId: string) {
    const docSnap = await getDoc(doc(venuesRef, venueId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // ✅ Optional: Update venue
  static async updateVenue(venueId: string, updates: Partial<{
    name: string;
    capacity: number;
    location: string;
    type: "lab" | "lecture_hall" | "seminar_room";
  }>) {
    await updateDoc(doc(venuesRef, venueId), updates);
  }

  // ✅ Optional: Get venues by type
  static async getVenuesByType(type: "lab" | "lecture_hall" | "seminar_room") {
    const q = query(venuesRef, where("type", "==", type));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}