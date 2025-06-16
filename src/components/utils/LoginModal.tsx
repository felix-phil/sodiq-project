import {
  Button,
  Field,
  Input,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef, useState } from "react";
import * as Yup from "yup";
import app from "../../../firebase";
import {
  signInWithEmailAndPassword,
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import useAuth from "@/hooks/use-auth";
import { AuthContextType } from "@/contexts/AuthContext";
interface IProps {
  open?: boolean;
  onDismiss?: () => void;
}

const LogingModal: FC<IProps> = ({ open = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<"login" | "register">("login");
  const appAuth = useAuth();

  const formik = useFormik<{
    email: string;
    password: string;
    fullName: string;
    role: "student" | "lecturer" | "admin";
  }>({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      role: "student",
    },
    onSubmit: async (values) => {
      try {
        const auth = getAuth(app);
        const db = getFirestore(app);

        let userCredential: UserCredential;
        let details: NonNullable<AuthContextType["user"]>;

        if (type === "login") {
          // Sign in
          userCredential = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );

          // Fetch from Firestore
          const userRef = doc(db, `users/${userCredential.user.uid}`);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) throw new Error("User not found in database");

          details = userSnap.data() as {
            id: string;
            email: string;
            fullName: string;
            role: "student" | "lecturer" | "admin";
          };
        } else {
          // Register
          userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password,
            
          );

          const userRef = doc(db, `users/${userCredential.user.uid}`);
          details = {
            id: userCredential.user.uid,
            email: values.email,
            fullName: values.fullName,
            role: values.role,
          };

          await setDoc(userRef, {
            ...details,
            createdAt: new Date().toISOString(),
          });
        }

        // ✅ Use the details immediately
        console.log("User details:", details);
        appAuth.login({ ...details, id: userCredential.user.uid }); // you can use this in your UI or store elsewhere

        toast.success(
          type === "login" ? "Login successful" : "Account created"
        );
        formik.resetForm();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      fullName: Yup.string().when([], {
        is: () => type === "register",
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      role: Yup.string().when([], {
        is: () => type === "register",
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
  });
  return (
    <motion.div
      variants={{
        open: { opacity: 1, visibility: "visible" },
        close: { opacity: 0, visibility: "hidden" },
      }}
      initial="close"
      exit={"close"}
      animate={open ? "open" : "close"}
      className="fixed font-primary inset-0 z-50 flex  bg-black/50 backdrop-blur-3xl"
    >
      <div
        ref={contentRef}
        className="bg-white 
            w-full   
            lg:w-[600px]
            max-w-[90vw]
            
            self-center
            mx-auto
            rounded-lg
            overflow-hidden flex px-[2%] flex-col justify-center items-center pb-10"
      >
        <div className="w-full h-full flex flex-col items-center py-[2%] divide-y divide-black/50">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-medium font-ins-sans text-primary text-2xl py-3">
              {type === "login" ? "Sign In" : "Sign Up"}
            </h1>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-full pt-5 font-ins-sans"
          >
            {type === "register" && (
              <div className="flex flex-col w-full mt-[3%]">
                <label className="text-sm font-medium text-[#61698D] mb-1">
                  Full Name
                </label>
                <Input
                  placeholder="Full Name"
                  name="fullName"
                  type="fullName"
                  className={
                    "outline-none border border-[#E2E4E9] rounded-sm h-[45px] px-5 bg-[#F6F8FA] w-full text-[#61698D]"
                  }
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>
            )}
            {type === "register" && (
              <div className="flex flex-col w-full mt-[3%]">
                <label className="text-sm font-medium text-[#61698D] mb-1">
                  You are
                </label>
                <RadioGroup
                  value={formik.values.role}
                  name="role"
                  onChange={(value) => formik.setFieldValue("role", value)}
                  className={"flex flex-row gap-x-10 my-3"}
                >
                  {["student", "lecturer"].map((role) => (
                    <Field key={role} className="flex items-center gap-2 cursor-pointer">
                      <Radio
                        value={role}
                        className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400"
                      >
                        <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                      </Radio>
                      <Label className={"cursor-pointer text-sm font-medium capitalize text-primary"}>{role}</Label>
                    </Field>
                  ))}
                </RadioGroup>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-[#61698D] mb-1">
                Email
              </label>
              <Input
                placeholder="Email Address"
                name="email"
                type="email"
                className={
                  "outline-none h-[45px] px-5 bg-[#F6F8FA] rounded-sm border border-[#E2E4E9] w-full text-[#61698D]"
                }
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <label className="text-sm font-medium text-[#61698D] mb-1">
                Password
              </label>
              <Input
                placeholder="*******"
                name="password"
                type="password"
                className={
                  "outline-none border border-[#E2E4E9] rounded-sm h-[45px] px-5 bg-[#F6F8FA] w-full text-[#61698D]"
                }
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full mt-[5%]">
              <Button
                disabled={!formik.isValid}
                type="submit"
                className={
                  "h-[45px] hover:scale-x-105 transition-all ease-in-out duration-75 disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary rounded-md overflow-hidden cursor-pointer text-white text-[16px] font-medium"
                }
              >
                {type === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </div>
            <div className="flex flex-col w-full mt-[2%] items-end">
              {type === "login" ? (
                <p className="text-sm text-[#61698D]">
                  {"Don't"} have an account?{" "}
                  <span
                    onClick={() => setType("register")}
                    className="text-primary cursor-pointer"
                  >
                    Sign up as lecturer or student
                  </span>
                </p>
              ) : (
                <p className="text-sm text-[#61698D]">
                  Already have an account?{" "}
                  <span
                    onClick={() => setType("login")}
                    className="text-primary cursor-pointer"
                  >
                    Sign in
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default LogingModal;
