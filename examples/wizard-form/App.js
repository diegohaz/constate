import React, { useContext, useState, useEffect } from "react";
import createContainer from "constate";

const Step = createContainer(useStep, value => [value.step]);
const Form = createContainer(useFormState, value => [value.values]);

function useStep({ initialStep = 0 } = {}) {
  const [step, setStep] = useState(initialStep);
  const next = () => setStep(step + 1);
  const previous = () => setStep(step - 1);
  return { step, next, previous };
}

function useFormState({ initialValues = {} } = {}) {
  const [values, setValues] = useState(initialValues);
  return {
    values,
    register: (name, initialValue) =>
      setValues(prevValues => ({
        ...prevValues,
        [name]: prevValues[name] || initialValue
      })),
    update: (name, value) =>
      setValues(prevValues => ({ ...prevValues, [name]: value }))
  };
}

function useFormInput({ register, values, update, name, initialValue = "" }) {
  useEffect(() => register(name, initialValue), []);
  return {
    name,
    onChange: e => update(name, e.target.value),
    value: values[name] || initialValue
  };
}

function AgeForm({ onSubmit }) {
  const state = useContext(Form.Context);
  const age = useFormInput({ name: "age", ...state });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(state.values);
      }}
    >
      <input type="number" placeholder="Age" autoFocus {...age} />
      <button>Next</button>
    </form>
  );
}

function NameEmailForm({ onSubmit, onBack }) {
  const state = useContext(Form.Context);
  const name = useFormInput({ name: "name", ...state });
  const email = useFormInput({ name: "email", ...state });
  return (
    <form
      onSubmit={e => {
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
  const { values } = useContext(Form.Context);
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}

function Wizard() {
  const { step, next, previous } = useContext(Step.Context);
  const steps = [AgeForm, NameEmailForm];
  const isLastStep = step === steps.length - 1;
  const props = {
    onSubmit: isLastStep
      ? values => alert(JSON.stringify(values, null, 2)) // eslint-disable-line no-alert
      : next,
    onBack: previous
  };
  return React.createElement(steps[step], props);
}

function App() {
  return (
    <Step.Provider>
      <Form.Provider initialValues={{ age: 18 }}>
        <Wizard />
        <Values />
      </Form.Provider>
    </Step.Provider>
  );
}

export default App;
