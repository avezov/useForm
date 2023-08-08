import { forEach, mapValues, values } from 'lodash'
import { AvailableValidators } from './Validator'
import FormField from './FormField'

export type FormProps = {
  fields: Record<string, FormFieldProps>
  onSubmit?(formData: Record<string, any>): void
}

export type FormFieldProps = {
  defaultValue?: number | string | number[] | string[] | boolean | boolean[],
  valueType?: any
  validators?: AvailableValidators[]
}

type FieldNames<T extends FormProps> = {
  [K in keyof T['fields']]?: FormField<T['fields'][K]['valueType']>
}

type SetFieldNames<T extends FormProps> = {
  [K in keyof T['fields']]?: T['fields'][K]['valueType']
}

type FormOnSubmit<T extends FormProps> = (formData: FieldNames<T>) => void;

export enum FormState {
  INIT = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAIL = 3
}

export class Form<T extends FormProps> {
  private refresh: () => void;
  private onSubmit: FormOnSubmit<T>
  private initialFormConfig: T

  fields: FieldNames<T> = {}
  isValid: boolean = false;
  state: FormState = FormState.INIT;

  constructor(props: T, refresh: () => void) {
    this.initialFormConfig = props;
    this.refresh = refresh;
    this.fields = mapValues(props.fields, field => new FormField(field, this.refresh))
    this.onSubmit = props.onSubmit as FormOnSubmit<T>
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

  getFormData() {
    return mapValues(this.fields, field => field?.value)
  }

  setFormData(data: SetFieldNames<T>) {
    forEach(data, (value, key) => {
      this.fields[key]?.setValue(value, false);
    })

    this.validate()
  }

  public setState(state: FormState) {
    this.state = state;
    this.refresh();
  }

  public get isSending() {
    return this.state === FormState.SENDING;
  }

  public get isSent() {
    return [FormState.SUCCESS, FormState.FAIL].includes(this.state);
  }

  public get isSuccess() {
    return this.state === FormState.SUCCESS;
  }

  public setOnSubmit(onSubmit: FormOnSubmit<T>) {
    this.onSubmit = onSubmit;
  }


  /**
   * Return to initial state of form and fields
   */
  public reset() {
    forEach(this.initialFormConfig.fields, (field, key) => {
      this.fields[key]?.setValue(field.defaultValue, false);
    })

    this.setState(FormState.INIT);
  }

  validate() {
    const results = values(this.fields).map(field => field?.validate())
    const isValid = results.every(valid => valid)
    this.setIsValid(isValid);
    return isValid
  }
}
