import { pull } from "lodash";
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
    if (this._value) {
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

  public setValue = (newValue: Value) => {
    this._value = newValue;
    this.refresh()
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

  validate = () => {
    const isValid = this.validators?.every(validator => validator?.validate())
    return isValid;
  }

  public pushToArray = (value: Flatten<Value>) => {
    (this._value as Value[]).push(value)
    this.refresh()
  }

  public removeFromArray = (value: Flatten<Value>) => {
    pull(this._value as [], value)
    this.refresh()
  }

}