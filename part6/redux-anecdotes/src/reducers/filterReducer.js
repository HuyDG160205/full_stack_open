import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    },
  },
})

// export const filterReducer = (state = '', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.data
//     default:
//       return state
//   }
// }

// export const setFilter = (filter) => {
//   return {
//     type: 'SET_FILTER',
//     data: filter,
//   }
// }

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer
