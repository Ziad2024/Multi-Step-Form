import { useState } from "react";
import "./App.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["firstname", "lastname"],
  },
  {
    id: "Step 2",
    name: "Contact Information",
    fields: ["email", "phone"],
  },
  {
    id: "Step 3",
    name: "Account Information",
    fields: ["country", "password"],
  },
];

const FormDataSchema = z.object({
  firstname: z.string().trim().min(3, "At least 3 characters").max(20),
  lastname: z.string().trim().min(3, "At least 3 characters").max(20),
  email: z.string().trim().email("Invalid email"),
  phone: z
    .string()
    .min(11, "Phone must be 11 digits")
    .max(11, "Phone must be 11 digits"),
  country: z.string().trim().min(4, "At least 4 characters"),
  password: z.string().trim().min(8, "At least 8 characters").max(20),
});

type FormData = z.infer<typeof FormDataSchema>;

function App() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
  });

  const [step, setStep] = useState<number>(1);
  const [prevStep, setPrevStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [data, setData] = useState<FormData | null>(null);
  const delta = step - prevStep;

  type FieldName = keyof FormData;

  const next = async (): Promise<void> => {
    const fields = steps[step - 1].fields;
    // validate before go to next step
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (step < steps.length) {
      setPrevStep(step);
      setStep(step + 1);
    }
  };

  const prev = (): void => {
    if (step > 1) {
      setPrevStep(step);
      setStep(step - 1);
    }
  };

  const ShowData: SubmitHandler<FormData> = (formData): void => {
    console.log(formData);
    setIsSubmitted(true);
    setData(formData);
  };

  return (
    <div>
      <ul className={`steps w-full mx-auto my-10`}>
        <li className={`step ${step >= 1 && "step-primary"}  `}>Register</li>
        <li className={`step ${step >= 2 && "step-primary"} `}>Choose plan</li>
        <li className={`step ${step >= 3 && "step-primary"} `}>Purchase</li>
      </ul>
      <>
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit(ShowData)}
            className={`w-[70%] mx-auto my-10 text-black overflow-hidden`}
          >
            {step === 1 && (
              <motion.section
                key={step}
                initial={{ opacity: 0, x: delta >= 0 ? "50%" : "-50%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <section className="flex flex-col gap-4">
                  <div className="flex gap-4 justify-center items-center flex-col text-black">
                    <input
                      placeholder="First Name"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("firstname")}
                    />
                    {errors.firstname && (
                      <p className="text-red-600">{errors.firstname.message}</p>
                    )}
                    <input
                      placeholder="Last Name"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("lastname")}
                    />
                    {errors.lastname && (
                      <p className="text-red-600">{errors.lastname.message}</p>
                    )}
                  </div>
                </section>
              </motion.section>
            )}
            {step === 2 && (
              <motion.section
                key={step}
                initial={{ opacity: 0, x: delta >= 0 ? "50%" : "-50%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <section className="flex flex-col gap-4">
                  <div className="flex gap-4 justify-center items-center flex-col text-black">
                    <input
                      placeholder="Email"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-600">{errors.email.message}</p>
                    )}
                    <input
                      type="number"
                      placeholder="Phone"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </section>
              </motion.section>
            )}
            {step === 3 && (
              <motion.section
                key={step}
                initial={{ opacity: 0, x: delta >= 0 ? "50%" : "-50%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <section className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 justify-center items-center flex-wrap text-black">
                    <input
                      placeholder="Country"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("country")}
                    />
                    {errors.country && (
                      <p className="text-red-600">{errors.country.message}</p>
                    )}
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-[40%] p-2 outline-none bg-white rounded-md"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </section>
              </motion.section>
            )}

            <div className="w-full my-10 flex mx-auto justify-between">
              <button
                type="button"
                disabled={step <= 1}
                onClick={prev}
                className="p-2 bg-white rounded-md"
              >
                Left
              </button>
              {step !== 3 && (
                <button
                  type="button"
                  onClick={next}
                  className="p-2 bg-white rounded-md"
                >
                  {step === 3 ? "Submit" : "Right"}
                </button>
              )}
              {step === 3 && (
                <button type="submit" className="p-2 bg-white rounded-md">
                  Submit
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="w-full h-screen flex justify-center items-center">
            {data && (
              <article className="text-center">
                <h2 className="text-2xl font-bold">
                  Welcome, {data.firstname} {data.lastname}!
                </h2>
                <p className="text-lg">Email: {data.email}</p>
                <p className="text-lg">Phone: {data.phone}</p>
                <p className="text-lg">Country: {data.country}</p>
                <p className="text-lg">Password: {data.password}</p>
              </article>
            )}
          </div>
        )}
      </>
    </div>
  );
}

export default App;
