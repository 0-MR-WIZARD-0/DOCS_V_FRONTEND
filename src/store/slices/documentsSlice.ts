import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Document } from "@/types/document";

interface DocumentsState {
  items: Document[];
  loading: boolean;
}

const initialState: DocumentsState = { items: [], loading: false };

export const fetchDocuments = createAsyncThunk("documents/fetch", async () => {
  const res = await api.get("/documents");
  return res.data as Document[];
});

export const updateDocuments = createAction<Document[]>("documents/update");

export const deleteDocument = createAsyncThunk("documents/delete", async (id: number) => {
  await api.delete(`/documents/${id}`);
  return id;
});

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(updateDocuments, (state, action) => {
                state.items = action.payload;
              })
      .addCase(fetchDocuments.pending, state => { state.loading = true; })
      .addCase(fetchDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(deleteDocument.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(d => d.id !== action.payload);
      });
  },
});

export default documentsSlice.reducer;
