import React from 'react'

import { InputField, useMeroForm } from 'mero-react-form'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const App = () => {
  const { values, handleSubmit } = useMeroForm({
    initialValues: {
      name: '',
      address: ''
    },
    onSubmit: async ({ values }) => {
      console.log({ name: values.name, address: values.address })
      await sleep(1000)
      alert(JSON.stringify(values, null, 2))
    }
  })

  // const handleSubmit = (e: any) => {
  //   e.preventDefault()
  //   console.log('File: App.tsx, Line: 15 => ', { touched, values })

  //   for (const target of e.target) {
  //     console.log({ [target.name]: target.value })
  //   }
  // }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField name='name' value={values.name} className='name-input' />
        <InputField
          name='address'
          value={values.address}
          className='address-input'
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default App
