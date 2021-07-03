import * as React from 'react'

// REference

// https://codesandbox.io/embed/jzm3jrrr03?fontsize=14&module=%2Fsrc%2FApp.js

interface IInputField extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  value?: string
  onBlur?: (e: any) => (pair: Record<string, string>) => void
}

const usePropState = (value = '') => {
  const [state, setState] = React.useState(value)

  React.useEffect(() => {
    setState(value)
  }, [value])

  return [state, setState] as const
}

export const InputField: React.FC<IInputField> = ({
  name,
  value,
  onBlur,
  ...rest
}) => {
  const [state, setState] = usePropState(value)

  const _onBlur = (e: any) => {
    if (onBlur) {
      onBlur(e)({ [name]: state })
    }
  }

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value)
  }

  return (
    <input
      name={name}
      value={state}
      onBlur={_onBlur}
      onChange={_onChange}
      {...rest}
    />
  )
}

const reducer = (state: any, action: any) => {
  const [name]: [string, unknown] = action.payload
    ? Object.entries(action.payload)[0]
    : ['', '']

  switch (action.type) {
    case 'SET_FIELD_VALUE': {
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload
        },
        touched: {
          ...state.touched,
          [name]: true
        }
      }
    }

    case 'SET_FIELD_ERROR': {
      console.log({ action })

      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.name]: action.payload.message
        }
      }
    }

    case 'RESET_ERROR': {
      return {
        ...state,
        errors: {}
      }
    }

    default:
      return { ...state }
  }
}

export interface IUseMeroForm<T, S> {
  onSubmit: ({ values }: { values: T }) => void
  initialValues: T
  validationSchema?: S
}

export const useMeroForm = <T, S>(props: IUseMeroForm<T, S>) => {
  if (!props.onSubmit) {
    throw new Error('Pleas pass onsubmit to useMeroForm !!')
  }

  const [state, dispatch] = React.useReducer(reducer, {
    values: props.initialValues,
    errors: {} as T,
    touched: {} as T,
    isSubmitting: false
  })

  const handleChange = (e: any) => {
    console.log('File: index.tsx, Line: 34 => ', e)
  }

  const handleBlur = (e: any) => (pair: any) => {
    e.persist()

    const hasValue = Object.values(pair).some(Boolean)

    if (!hasValue) {
      return
    }

    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {
        ...pair
      }
    })
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget

    const formElements = form.elements as typeof form.elements &
      typeof props.initialValues

    const _values: T = {} as T
    const _errors: T = {} as T

    Object.keys(props.initialValues).forEach((key) => {
      _values[key] = formElements[key].value

      dispatch({
        type: 'SET_FIELD_VALUE',
        payload: {
          [key]: formElements[key].value
        }
      })
    })

    const schema = props.validationSchema as any

    try {
      const isValid = schema?.isValidSync(_values)

      if (!isValid) {
        schema
          .validate(_values, {
            abortEarly: false
          })
          .catch((e: any) => {
            const valErrors = (e.inner as any[]) || []

            if (valErrors.length) {
              valErrors.forEach((err: any) => {
                _errors[err.path || ''] = err.message || ''

                dispatch({
                  type: 'SET_FIELD_ERROR',
                  payload: {
                    name: err.path || '',
                    message: err.message || ''
                  }
                })
              })
            }
          })
      } else {
        dispatch({ type: 'RESET_ERROR' })

        props.onSubmit({
          values: _values
        })
      }
    } catch (error) {
      console.log('Validation failed', error)
    }
  }

  const removeError = (e: any) => {
    const key = e.target.name

    if (state?.errors[key]) {
      dispatch({
        type: 'SET_FIELD_ERROR',
        payload: {
          name: key,
          message: ''
        }
      })
    }
  }

  return { handleChange, handleBlur, handleSubmit, removeError, ...state }
}
