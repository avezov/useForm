import { pull, pullAll, isEqual } from "lodash";
import { ChangeEvent } from "react";
import { FormFieldProps } from "./Form";
import { Validators } from "./Validator";

type Flatten<T> = T extends any[] ? T[number] : T;

export default class FormField<Value> {
  private _value: Value;
  private type;
  error: boolean = false;
  errorText?: string;

  private refresh: () => void;
  private validators: Validators<Value>[] = [];

  constructor(props: FormFieldProps, refresh: () => void) {
    this._value = props.defaultValue as Value;
    this.type = props.valueType ?? typeof props.defaultValue;
    this.refresh = refresh;
    this.validators = props.validators?.map(([validator, params]) => {
      return new validator({ field: this, params })
    }) ?? []
  }

  get value() {
    if (typeof this._value !== 'undefined') {
      return this._value;
    }

    switch (typeof this.type) {
      case 'boolean':
        return false as Value;

      case 'string':
        return '' as Value;

      case 'object':
        if (Array.isArray(this.type)) {
          return [] as Value;
        }
        break;

    }

  }

  public setValue = (newValue: Value, refresh = true) => {
    if (!isEqual(this._value, newValue)) {
      this._value = newValue;
    }

    if (refresh) {
      this.refresh()
    }
  }

  setError = (isValid: boolean, errorText?: string) => {
    this.error = !isValid;
    this.errorText = errorText;
    this.refresh()
  }

  public handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value as Value;
    this.setValue(newValue);
  }

  public toggle = () => {
    if (typeof this.type !== 'boolean') {
      console.warn('@xvii/useform: You tried to call toggle() on non-boolean value')
    }

    this.setValue(!Boolean(this.value) as Value)
  }

  public toggleInArray = (value: Flatten<Value>) => {
    if (!(this.type instanceof Array)) {
      console.warn('@xvii/useform: You tried to call toggleInArray() on a non-array value')
    }

    const exists = (this.value as Flatten<Value>[]).includes(value);

    if (exists) {
      this.removeFromArray(value)
    } else {
      this.pushToArray(value)
    }
  }

  validate = () => {
    const isValid = this.validators?.every(validator => validator?.validate())
    return isValid;
  }

  public pushToArray = (value: Flatten<Value> | Value) => {
    let newValue = [
      ...(this._value as Value[])
    ];

    if (value instanceof Array) {
      newValue = [
        ...newValue,
        ...value
      ]
    } else {
      newValue.push(value)
    }

    this._value = newValue as Value;
    this.refresh()
  }

  public removeFromArray = (value: Flatten<Value> | Value) => {
    let newValue = [
      ...(this._value as Value[])
    ]

    if (value instanceof Array) {
      pullAll(newValue as [], value)
    } else {
      pull(newValue as [], value)
    }

    this._value = newValue as Value;
    this.refresh()
  }

}