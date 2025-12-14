import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Subsection } from "@/types/subSection";

interface SubsectionsState {
  items: Subsection[];
  loading: boolean;
}

const initialState: SubsectionsState = { items: [], loading: false };

export const fetchSubsections = createAsyncThunk("subsections/fetch", async () => {
  const res = await api.get("/subsections");
  return res.data as Subsection[];
});

export const deleteSubsection = createAsyncThunk(
  "subsections/delete",
  async ({ subsectionId }: { subsectionId: number }) => {
    await api.delete(`/subsections/${subsectionId}`);
    return subsectionId;
  }
);

const subsectionsSlice = createSlice({
  name: "subsections",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSubsections.pending, state => { state.loading = true; })
      .addCase(fetchSubsections.fulfilled, (state, action: PayloadAction<Subsection[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(deleteSubsection.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      })
  },
});

export default subsectionsSlice.reducer;