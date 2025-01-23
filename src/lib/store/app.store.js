import { create } from "zustand";

const createInitialState = () => ({
  moodPickerOpen: false,
  selectedSummaryId: undefined,
  callRatingOpen: false,
  chatSuggestionOpen: false,
  chatSummmaryOpen: false,
});

const createActions = (set, get) => ({
  setMoodPickerOpen: (value) => {
    if (get().moodPickerOpen !== value) {
      set({ moodPickerOpen: value });
    }
  },

  setCallRatingOpen: (value) => {
    if (get().callRatingOpen !== value) {
      set({ callRatingOpen: value });
    }
  },

  setChatSummmaryOpen: (value) => {
    if (get().chatSummmaryOpen !== value) {
      set({ chatSummmaryOpen: value });
    }
  },
  setChatSummaryId: (id) => {
    if (get().selectedSummaryId !== id) {
      set({ selectedSummaryId: id });
    }
  },
  setChatSuggestionOpen: (value) => {
    if (get().chatSuggestionOpen !== value) {
      set({ chatSuggestionOpen: value });
    }
  },
});

// Selector functions
const createSelectors = (store) => ({
  useMoodPicker: () => store((state) => state.moodPickerOpen),
  useSelectedSummary: () => store((state) => state.selectedSummaryId),
  useCallRating: () => store((state) => state.callRatingOpen),
  useChatSuggestion: () => store((state) => state.chatSuggestionOpen),
  useChatSummary: () => store((state) => state.chatSummmaryOpen),
});

// Create and export the store
export const useAppStore = create((set, get) => ({
  ...createInitialState(),
  ...createActions(set, get),
}));

// Export individual selectors
export const {
  useMoodPicker,
  useSelectedSummary,
  useCallRating,
  useChatSuggestion,
  useChatSummary,
} = createSelectors(useAppStore);
