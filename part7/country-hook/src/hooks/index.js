import axios from 'axios'
import { useEffect, useState } from 'react'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then((response) => {
        setCountry(
          response.data
            ? { found: true, data: response.data }
            : { found: false }
        )
      })
      .catch(() => setCountry({ found: false }))
  }, [name])

  return country
}

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

export { useCountry, useField }
