import { BasicLayout, Button } from "components";
import { useRequestPasswordResetMutation } from "generated";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth/Auth.module.scss";

type ResetFormValues = { email: string };

function RequestResetForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetFormValues>();

  const requestReset = useRequestPasswordResetMutation({
    onSuccess: (data: { requestPasswordReset: boolean }) => {
      if (data.requestPasswordReset) setIsSuccess(true);
    },
    onError: (error) => {
      if (error instanceof Error)
        setError("email", {
          type: "manual",
          message: error.message,
        });
    },
  });

  const isLoading = requestReset.isLoading;

  const submitForm = (data: ResetFormValues) => {
    requestReset.mutate({
      email: data.email,
    });
  };

  if (isSuccess)
    return (
      <div className={styles.container}>
        <h1>Check your email</h1>
        <p>We've sent you instructions on how to reset your password.</p>
        <Link href={"/login"} passHref>
          <Button label="Login" size="large" variant="primary" theme="blue" />
        </Link>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1 className="title">Reset your password</h1>
      <p>Please enter the email address associated with your account.</p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)}>
          <div
            className={`${styles.inputWrapper} ${
              errors.email && styles.invalid
            }`}
          >
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <small className={styles.inputError}>{errors.email?.message}</small>
          </div>
          <Button
            label={isLoading ? "Loading..." : "Submit"}
            size="large"
            variant="primary"
            theme="blue"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}

RequestResetForm.getLayout = (page: ReactNode) => (
  <BasicLayout>{page}</BasicLayout>
);

export { RequestResetForm };
