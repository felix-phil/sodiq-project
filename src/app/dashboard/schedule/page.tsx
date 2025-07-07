import { VenueModel } from "@/models/Labs";
import SchedulePageConponent from "./Schedule";
import { UserModel } from "@/models/User";
import { CourseModel } from "@/models/Courses";

const SchedulesPage = async () => {
  const venues = await VenueModel.getAllVenues();
  const lecturers = await UserModel.getAllLecturers();
  const courses = await CourseModel.getAllCourses();

  return (
    <SchedulePageConponent
      lecturers={lecturers}
      courses={courses}
      venues={venues}
    />
  );
};

export default SchedulesPage;
