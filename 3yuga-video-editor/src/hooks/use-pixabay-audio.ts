import { useState, useCallback } from "react";
import { IAudio } from "@designcombo/types";

interface PixabayAudio extends Partial<IAudio> {
  metadata?: {
    pixabay_id: number;
    user_id: number;
    user_name: string;
    duration: number;
    tags: string;
  };
}

interface UsePixabayAudioReturn {
  audios: PixabayAudio[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  hasNextPage: boolean;
  searchAudio: (query: string, page?: number) => Promise<void>;
  loadPopularAudio: (page?: number) => Promise<void>;
  clearAudio: () => void;
}

export function usePixabayAudio(): UsePixabayAudioReturn {
  const [audios, setAudios] = useState<PixabayAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const transformPixabayAudio = (hit: any): PixabayAudio => {
    return {
      id: `pixabay_${hit.id}`,
      name: hit.title || hit.tags?.split(",")[0] || "Pixabay Audio",
      type: "audio",
      details: {
        src: hit.previewURL || hit.url || ""
      },
      metadata: {
        pixabay_id: hit.id,
        user_id: hit.user_id || 0,
        user_name: hit.user || "Pixabay",
        duration: hit.duration || 0,
        tags: hit.tags || ""
      }
    };
  };

  const searchAudio = useCallback(async (query: string, page = 1) => {
    const pixabayKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
    if (!pixabayKey) {
      setError("Pixabay API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/pixabay-proxy?query=${encodeURIComponent(query)}&page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const transformedAudios = data.hits?.map(transformPixabayAudio) || [];

      setAudios(transformedAudios);
      setTotalResults(data.total || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.hits?.length && data.hits.length === 20);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search audio";
      console.error("Pixabay search error:", errorMessage);
      setError(errorMessage);
      setAudios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPopularAudio = useCallback(async (page = 1) => {
    const pixabayKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
    if (!pixabayKey) {
      setError("Pixabay API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/pixabay-proxy?page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const transformedAudios = data.hits?.map(transformPixabayAudio) || [];

      setAudios(transformedAudios);
      setTotalResults(data.total || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.hits?.length && data.hits.length === 20);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load popular audio";
      console.error("Pixabay load popular error:", errorMessage);
      setError(errorMessage);
      setAudios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAudio = useCallback(() => {
    setAudios([]);
    setError(null);
    setTotalResults(0);
    setCurrentPage(1);
    setHasNextPage(false);
  }, []);

  return {
    audios,
    loading,
    error,
    totalResults,
    currentPage,
    hasNextPage,
    searchAudio,
    loadPopularAudio,
    clearAudio
  };
}