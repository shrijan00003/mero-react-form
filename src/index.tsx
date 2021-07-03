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
  switch (action.type) {
    case 'SET_FIELD_VALUE': {
      const [name]: [string, unknown] = Object.entries(action.payload)[0]

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
    default:
      return { ...state }
  }
}

export interface IUseMeroForm<T> {
  onSubmit: ({ values }: { values: T }) => void
  initialValues: T
}

export const useMeroForm = <T,>(props: IUseMeroForm<T>) => {
  if (!props.onSubmit) {
    throw new Error('Pleas pass onsubmit to useMeroForm !!')
  }

  const [state, dispatch] = React.useReducer(reducer, {
    values: props.initialValues,
    errors: {},
    touched: {},
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

    Object.keys(props.initialValues).forEach((key) => {
      dispatch({
        type: 'SET_FIELD_VALUE',
        payload: {
          [key]: formElements[key].value
        }
      })
    })

    props.onSubmit({
      values: state.values
    })
  }

  return { handleChange, handleBlur, handleSubmit, ...state }
}
