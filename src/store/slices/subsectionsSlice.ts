import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Subsection } from "@/types/subSection";

interface SubsectionsState {
  items: Subsection[];
  loading: boolean;
}

const initialState: SubsectionsState = { items: [], loading: false };

// Загрузка всех подразделов
export const fetchSubsections = createAsyncThunk("subsections/fetch", async () => {
  const res = await api.get("/subsections");
  return res.data as Subsection[];
});

// Удаление подраздела
export const deleteSubsection = createAsyncThunk(
  "subsections/delete",
  async ({ subsectionId }: { subsectionId: number }) => {
    await api.delete(`/subsections/${subsectionId}`);
    return subsectionId;
  }
);

// Обновление порядка подразделов
export const updateSubsectionsOrder = createAsyncThunk(
  "subsections/updateOrder",
  async ({ subsectionId, newOrder }: { subsectionId: number, newOrder: number }) => {
    // Отправляем запрос на сервер для обновления порядка
    const res = await api.put(`/subsections/${subsectionId}/move/${newOrder}`);
    return res.data as Subsection;  // Возвращаем обновленные данные
  }
);

const subsectionsSlice = createSlice({
  name: "subsections",
  initialState,
  reducers: {
    // Здесь мы можем реализовать дополнительное обновление, если нужно
    updateSubsections: (state, action: PayloadAction<Subsection[]>) => {
      state.items = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(updateSubsectionsOrder.fulfilled, (state, action) => {
        const updatedSubsection = action.payload;

        // Обновляем локальный порядок в массиве
        const updatedItems = state.items.map(subsection => {
          if (subsection.id === updatedSubsection.id) {
            return updatedSubsection;  // Обновляем подраздел
          }
          return subsection;
        });

        state.items = updatedItems;
      })
      .addCase(fetchSubsections.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSubsections.fulfilled, (state, action: PayloadAction<Subsection[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(deleteSubsection.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      });
  },
});

export const { updateSubsections } = subsectionsSlice.actions;
export default subsectionsSlice.reducer;
