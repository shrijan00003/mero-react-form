import * as React from 'react'
import styles from './styles.module.css'

// REference

// https://codesandbox.io/embed/jzm3jrrr03?fontsize=14&module=%2Fsrc%2FApp.js

interface Props {
  text: string
}

interface IInputField {
  name: string
  value?: string
  handleBlur?: (pair: Record<string, string>) => (e: any) => void
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
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
  handleBlur
}) => {
  const [state, setState] = usePropState(value)

  const _onBlur = (e: any) => {
    if (handleBlur) {
      handleBlur({ [name]: state })(e)
    }
  }

  return (
    <input
      name={name}
      value={state}
      onBlur={_onBlur}
      onChange={(e) => setState(e.target.value)}
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

export const useMeroForm = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, {
    values: props.initialValues,
    errors: {},
    touched: {},
    isSubmitting: false
  })

  const handleChange = (e: any) => {
    console.log('File: index.tsx, Line: 34 => ', e)
  }

  const handleBlur = (pair: any) => (e: any) => {
    e.persist()

    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {
        ...pair
      }
    })
  }

  return { handleChange, handleBlur, ...state }
}
