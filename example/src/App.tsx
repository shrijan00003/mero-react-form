import React from 'react'

import { ExampleComponent, InputField, useMeroForm } from 'mero-form'
import 'mero-form/dist/index.css'

const App = () => {
  const { handleBlur, values, touched } = useMeroForm({
    initialValues: {
      name: ''
    }
  })

  console.log('File: App.tsx, Line: 11 => ', { values, touched })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log('File: App.tsx, Line: 16 => ', e.target.name.value)
    console.log('File: App.tsx, Line: 18 => ', { values })

    for (const target of e.target) {
      console.log({ [target.name]: target.value })
    }
  }

  return (
    <>
      <ExampleComponent text='Create React Library Example 😄' />
      <form onSubmit={handleSubmit}>
        <InputField name='name' handleBlur={handleBlur} value={values.name} />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default App
