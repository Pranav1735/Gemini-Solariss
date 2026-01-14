import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart')
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, quantity })
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity })
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`)
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart')
      return { items: [], subtotal: 0, discount: 0, total: 0, itemCount: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/coupon', { code })
      return response.data.cart
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = []
      state.subtotal = 0
      state.discount = 0
      state.total = 0
      state.itemCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        const cart = action.payload
        state.items = cart.items || []
        state.subtotal = cart.subtotal || 0
        state.discount = cart.discount || 0
        state.total = cart.total || 0
        state.itemCount = cart.itemCount || 0
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const cart = action.payload
        state.items = cart.items || []
        state.subtotal = cart.subtotal || 0
        state.discount = cart.discount || 0
        state.total = cart.total || 0
        state.itemCount = cart.itemCount || 0
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const cart = action.payload
        state.items = cart.items || []
        state.subtotal = cart.subtotal || 0
        state.discount = cart.discount || 0
        state.total = cart.total || 0
        state.itemCount = cart.itemCount || 0
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const cart = action.payload
        state.items = cart.items || []
        state.subtotal = cart.subtotal || 0
        state.discount = cart.discount || 0
        state.total = cart.total || 0
        state.itemCount = cart.itemCount || 0
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.subtotal = 0
        state.discount = 0
        state.total = 0
        state.itemCount = 0
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        const cart = action.payload
        state.items = cart.items || []
        state.subtotal = cart.subtotal || 0
        state.discount = cart.discount || 0
        state.total = cart.total || 0
        state.itemCount = cart.itemCount || 0
      })
  },
})

export const { clearCartState } = cartSlice.actions
export default cartSlice.reducer

