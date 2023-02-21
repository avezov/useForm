import { ChangeEvent } from 'react'
import { mapValues, pull, values } from 'lodash'
import { AvailableValidators, Validators } from './Validator'

export type FormProps = {
  fields: Record<string, FormFieldProps>
  onSubmit?(formData: Record<string, any>): void
}

export type FormFieldProps = {
  defaultValue?: number | string | number[] | string[] | boolean | boolean[],
  valueType?: any
  validators?: AvailableValidators[]
}

type Flatten<T> = T extends any[] ? T[number] : T;

type FieldNames<T extends FormProps> = {
  [K in keyof T['fields']]?: FormField<T['fields'][K]['valueType']>
}

export class Form<T extends FormProps> {
  private refresh: () => void;
  private onSubmit: (formData: FieldNames<T>) => void;

  fields: FieldNames<T> = {}
  isValid: boolean = false;

  constructor(props: T, refresh: () => void) {
    this.refresh = refresh;
    this.fields = mapValues(props.fields, field => new FormField(field, this.refresh))
    this.onSubmit = props.onSubmit as (formData: FieldNames<T>) => void;
  }

  handleSubmit = () => {
    const isValid = this.validate();

    if (isValid) {
      const formData = this.getFormData();
      this.onSubmit?.(formData)
    }

    return isValid;
  }

  private setIsValid(isValid: boolean) {
    this.isValid = isValid;
    this.refresh()
  }

  getFormData(): FieldNames<T> {
    return mapValues(this.fields, field => field?.value)
  }

  validate() {
    const results = values(this.fields).map(field => field?.validate())
    const isValid = results.every(valid => valid)
    this.setIsValid(isValid);
    return isValid
  }
}

export class FormField<Value> {
  private _value: Value;
  private type;
  error: boolean = false;
  errorText?: string;

  private refresh: () => void;
  private validators: Validators<Value>[] = [];

  constructor(props: FormFieldProps, refresh: () => void) {
    this._value = props.defaultValue as Value;
    this.type = props.valueType;
    this.refresh = refresh;
    this.validators = props.validators?.map(([validator, params]) => {
      return new validator({ field: this, params })
    }) ?? []
  }

  get value() {
    if (this._value) {
      return this._value;
    }

    if (typeof this.type === 'boolean') {
      return false as Value;
    }

    if (Array.isArray(this.type)) {
      return [] as Value;
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