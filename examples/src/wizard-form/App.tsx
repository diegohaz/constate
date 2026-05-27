import constate from "constate";
import { useEffect, useState } from "react";

type FormValues = Partial<Record<string, string | number>>;

function useStep({ initialStep = 0 }: { initialStep?: number } = {}) {
  const [step, setStep] = useState(initialStep);
  const next = () => setStep(step + 1);
  const previous = () => setStep(step - 1);
  return { step, next, previous };
}

function useFormState({
  initialValues = {},
}: { initialValues?: FormValues } = {}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  return {
    values,
    register: (name: string, initialValue: string | number) =>
      setValues((prevValues) => ({
        ...prevValues,
        [name]: prevValues[name] || initialValue,
      })),
    update: (name: string, value: string | number) =>
      setValues((prevValues) => ({ ...prevValues, [name]: value })),
  };
}

const [StepProvider, useStepContext] = constate(useStep);
const [FormProvider, useFormContext, useFormValues] = constate(
  useFormState,
  (value) => value,
  (value) => value.values,
);

type FormState = ReturnType<typeof useFormState>;

interface UseFormInputProps extends FormState {
  name: string;
  initialValue?: string | number;
}

function useFormInput({
  register,
  values,
  update,
  name,
  initialValue = "",
}: UseFormInputProps) {
  useEffect(() => register(name, initialValue), []);
  return {
    name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      update(name, e.target.value),
    value: values[name] || initialValue,
  };
}

interface StepProps {
  onSubmit: (values: FormValues) => void;
  onBack?: () => void;
}

function AgeForm({ onSubmit }: StepProps) {
  const state = useFormContext();
  const age = useFormInput({ name: "age", ...state });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(state.values);
      }}
    >
      <input type="number" placeholder="Age" autoFocus {...age} />
      <button>Next</button>
    </form>
  );
}

function NameEmailForm({ onSubmit, onBack }: StepProps) {
  const state = useFormContext();
  const name = useFormInput({ name: "name", ...state });
  const email = useFormInput({ name: "email", ...state });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(state.values);
      }}
    >
      <button type="button" onClick={onBack}>
        Back
      </button>
      <input type="text" placeholder="Name" autoFocus {...name} />
      <input type="email" placeholder="Email" {...email} />
      <button type="submit">Submit</button>
    </form>
  );
}

function Values() {
  const values = useFormValues();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}

function Wizard() {
  const { step, next, previous } = useStepContext();
  const steps = [AgeForm, NameEmailForm];
  const isLastStep = step === steps.length - 1;
  const Step = steps[step];
  return (
    <Step
      onSubmit={
        isLastStep ? (values) => alert(JSON.stringify(values, null, 2)) : next
      }
      onBack={previous}
    />
  );
}

function App() {
  return (
    <StepProvider>
      <FormProvider initialValues={{ age: 18 }}>
        <Wizard />
        <Values />
      </FormProvider>
    </StepProvider>
  );
}

export default App;
