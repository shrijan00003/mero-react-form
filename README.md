# Mero React Form

> Simple react form

[![NPM](https://img.shields.io/npm/v/mero-react-form.svg)](https://www.npmjs.com/package/mero-react-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save mero-react-form
# Or
yarn add mero-react-form
```

## Usage

```tsx
import React from 'react'
import * as yup from 'yup'

import { InputField, useMeroForm } from 'mero-react-form'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const schema = yup.object().shape({
  name: yup.string().required('Name required'),
  address: yup.string().min(18, 'Must be at least 18 len')
})

const App = () => {
  const { values, handleSubmit, errors, removeError } = useMeroForm({
    initialValues: {
      name: '',
      address: ''
    },
    validationSchema: schema,
    onSubmit: async ({ values }) => {
      console.log({ name: values.name, address: values.address })
      await sleep(1000)
      alert(JSON.stringify(values, null, 2))
    }
  })

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField name='name' value={values.name} className='name-input' />
          <div> {errors.name ? errors.name : null}</div>
        </div>
        <div>
          <InputField
            name='address'
            value={values.address}
            className='address-input'
            onKeyUp={removeError}
          />
          <div> {errors.address ? errors.address : null}</div>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default App
```

## License

MIT © [shrijan00003](https://github.com/shrijan00003)
