import React, { useEffect } from "react";
import { Provider, useContextState } from "constate";

function useStep() {
  const [step, setStep] = useContextState("step", 0);
  const next = () => setStep(step + 1);
  const previous = () => setStep(step - 1);
  return { step, next, previous };
}

function useForm({ key, onSubmit }) {
  const [values, setValues] = useContextState(key, {});
  const state = {
    values,
    register: (name, initialValue) =>
      setValues(prevValues => ({
        ...prevValues,
        [name]: prevValues[name] || initialValue
      })),
    update: (name, value) =>
      setValues(prevValues => ({ ...prevValues, [name]: value }))
  };
  const form = {
    onSubmit: e => {
      e.preventDefault();
      onSubmit(values);
    }
  };
  return { form, state };
}

function useFormInput({ register, values, update, name, initialValue = "" }) {
  useEffect(() => register(name, initialValue), []);
  return {
    name,
    onChange: e => update(name, e.target.value),
    value: values[name] || initialValue
  };
}

function Step1({ formKey }) {
  const { next } = useStep();
  const { form, state } = useForm({ key: formKey, onSubmit: next });
  const age = useFormInput({ name: "age", ...state });
  return (
    <form {...form}>
      <input type="number" placeholder="Age" autoFocus {...age} />
      <button>Next</button>
    </form>
  );
}

function Step2({ formKey }) {
  const { previous } = useStep();
  const { form, state } = useForm({
    key: formKey,
    onSubmit: values => alert(JSON.stringify(values, null, 2)) // eslint-disable-line no-alert
  });
  const name = useFormInput({ name: "name", ...state });
  const email = useFormInput({ name: "email", ...state });
  return (
    <form {...form}>
      <button type="button" onClick={previous}>
        Back
      </button>
      <input type="text" placeholder="Name" autoFocus {...name} />
      <input type="email" placeholder="Email" {...email} />
      <button type="submit">Submit</button>
    </form>
  );
}

function Wizard() {
  const { step } = useStep();
  const steps = [Step1, Step2];
  return React.createElement(steps[step], { formKey: "form1" });
}

function App() {
  return (
    <Provider devtools>
      <Wizard />
    </Provider>
  );
}

export default App;
