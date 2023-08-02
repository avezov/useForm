import { useEffect, useMemo, useReducer } from "react";
import { Form, FormProps } from "./Form";

export function useForm<T extends FormProps>(props: T) {
  const [, refresh] = useReducer((r) => r + 1, 0)
  const cachedProps = useMemo(() => props, [props])

  const form = useMemo(() => {
    return new Form<T>(cachedProps, refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.onSubmit) {
      form.setOnSubmit(props.onSubmit)
    }
  }, [
    form,
    props.onSubmit
  ])

  return form
}
