# @xvii/useForm

Forms for ReactJS.

# Installation

```bash
npm install --save @xvii/useform
```

# Example

```js
import { useForm } from '@xvii/useform';

const form = useForm({
  onSubmit(formData) {
    console.log("Submit", formData);
  },
  fields: {
    login: {
      valueType: String(),
      validators: [
        notEmpty({ errorText: "Login cannot be empty" }),
        minLength({
          errorText: "The login must be longer than 3 characters.",
          minLength: 3,
        }),
      ],
    },
    password: {
      defaultValue: "",
      validators: [notEmpty({ errorText: "Password cannot be empty" })],
    },
    remember: {
      defaultValue: false,
      valueType: Boolean(),
    },
  },
});
```

```jsx
<TextField
  label="Login"
  error={form.fields.login?.error}
  helperText={form.fields.login?.errorText}
  onChange={form.fields.login?.handleChange}
  value={form.fields.login?.value}
/>

<Checkbox
  checked={form.fields.remember?.value}
  onChange={form.fields.remember?.toggle}
/>
```

# Form

| Property | Type | Description |
| --- | --- | --- |
| fields | FormField | List of form fields |
| getFormData | () => data | Returns an object with values of all fields |
| handleSubmit | () => boolean | Handler function for submitting the form |
| isValid | boolean | The current validity status of all fields |
| setFormData | (data) => void | Sets the values of the form fields |
| validate | () => void | Force validation of all fields |


# FormField

| Property | Type | Description |
| --- | --- | --- |
| error | boolean | Validation error state |
| errorText | string | Description of error |
| handleChange | (evt) => void | Handler for `onChange` |
| pushToArray | (value) => void | Add value for arrayable fields |
| removeFromArray | (value) => void | Remove value from arrayable fields |
| setValue | (value) => void | Set value of field |
| toggle | () => void | Toggler for boolean values |
| validate | () => void | Force validation of field |
| value | | Value of field |