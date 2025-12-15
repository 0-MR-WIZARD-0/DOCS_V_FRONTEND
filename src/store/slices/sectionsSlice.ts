import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Section } from "@/types/section";

interface SectionsState {
  items: Section[];
  loading: boolean;
}

const initialState: SectionsState = { items: [], loading: false };

export const fetchSections = createAsyncThunk("sections/fetch", async () => {
  const res = await api.get("/sections");
  return res.data as Section[];
});

export const updateSections = createAction<Section[]>("sections/update");

export const deleteSection = createAsyncThunk("sections/delete", async (id: number) => {
  await api.delete(`/sections/${id}`);
  return id;
});

const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateSections, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchSections.pending, state => { state.loading = true; })
      .addCase(fetchSections.fulfilled, (state, action: PayloadAction<Section[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(deleteSection.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      })

  },
});

export default sectionsSlice.reducer;