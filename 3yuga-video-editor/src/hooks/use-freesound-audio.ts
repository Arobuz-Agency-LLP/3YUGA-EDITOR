import { useState, useCallback } from "react";
import { IAudio } from "@designcombo/types";

interface FreesoundAudio extends Partial<IAudio> {
  metadata?: {
    freesound_id: number;
    user_id: number;
    user_name: string;
    duration: number;
    description: string;
  };
}

interface FreesoundAudioResponse {
  audios: FreesoundAudio[];
  count: number;
  next?: string;
  previous?: string;
}

interface UseFreesoundAudioReturn {
  audios: FreesoundAudio[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  hasNextPage: boolean;
  searchAudio: (query: string, page?: number) => Promise<void>;
  loadPopularAudio: (page?: number) => Promise<void>;
  searchAudioAppend: (query: string, page?: number) => Promise<void>;
  loadPopularAudioAppend: (page?: number) => Promise<void>;
  clearAudio: () => void;
}

// Cache for popular audio
interface PopularAudioCache {
  data: FreesoundAudio[];
  timestamp: number;
  page: number;
  totalResults: number;
}

const popularAudioCache: PopularAudioCache = {
  data: [],
  timestamp: 0,
  page: 1,
  totalResults: 0
};

// Cache duration: 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

const clearPopularAudioCache = () => {
  popularAudioCache.data = [];
  popularAudioCache.timestamp = 0;
  popularAudioCache.page = 1;
  popularAudioCache.totalResults = 0;
};

/**
 * Hook for fetching and managing Freesound audio.
 *
 * Features:
 * - Caches popular audio for 10 minutes
 * - Supports search functionality
 * - Provides direct audio URLs (no CORS issues)
 * - Includes error handling and loading states
 * - Transforms Freesound API response to IAudio format
 */
export function useFreesoundAudio(): UseFreesoundAudioReturn {
  const [audios, setAudios] = useState<FreesoundAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const transformFreesoundAudio = (hit: any): FreesoundAudio => {
    const previewUrl = hit.previews?.["preview-hq-mp3"] || hit.previews?.["preview-lq-mp3"] || "";
    
    // Use our proxy endpoint
    const audioUrl = previewUrl ? `/api/freesound-proxy?url=${encodeURIComponent(previewUrl)}` : "";
    
    return {
      id: `freesound_${hit.id}`,
      name: hit.name || "Freesound Audio",
      type: "audio",
      details: {
        src: audioUrl
      },
      metadata: {
        freesound_id: hit.id,
        user_id: hit.user?.id || 0,
        user_name: hit.user?.username || "Freesound",
        duration: hit.duration || 0,
        description: hit.description || ""
      }
    };
  };

  const searchAudio = useCallback(async (query: string, page = 1) => {
    const freesoundKey = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;
    if (!freesoundKey) {
      setError("Freesound API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(
        query
      )}&token=${freesoundKey}&page_size=20&page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedAudios = data.results?.map(transformFreesoundAudio) || [];

      setAudios(transformedAudios);
      setTotalResults(data.count || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search audio");
      setAudios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAudioAppend = useCallback(async (query: string, page = 1) => {
    const freesoundKey = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;
    if (!freesoundKey) {
      setError("Freesound API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(
        query
      )}&token=${freesoundKey}&page_size=20&page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedAudios = data.results?.map(transformFreesoundAudio) || [];

      setAudios((prev) => [...prev, ...transformedAudios]);
      setTotalResults(data.count || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search audio");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPopularAudio = useCallback(async (page = 1) => {
    const freesoundKey = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;
    if (!freesoundKey) {
      setError("Freesound API key not configured");
      return;
    }

    const now = Date.now();
    const isCacheValid =
      popularAudioCache.data.length > 0 &&
      popularAudioCache.page === page &&
      now - popularAudioCache.timestamp < CACHE_DURATION;

    if (isCacheValid) {
      setAudios(popularAudioCache.data);
      setTotalResults(popularAudioCache.totalResults);
      setCurrentPage(page);
      setHasNextPage(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sort by rating to get popular sounds
      const url = `https://freesound.org/apiv2/search/text/?query=sound&token=${freesoundKey}&page_size=20&page=${page}&sort=rating_desc`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedAudios = data.results?.map(transformFreesoundAudio) || [];

      // Cache the data
      popularAudioCache.data = transformedAudios;
      popularAudioCache.timestamp = now;
      popularAudioCache.page = page;
      popularAudioCache.totalResults = data.count || 0;

      setAudios(transformedAudios);
      setTotalResults(data.count || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load popular audio");
      setAudios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPopularAudioAppend = useCallback(async (page = 1) => {
    const freesoundKey = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;
    if (!freesoundKey) {
      setError("Freesound API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://freesound.org/apiv2/search/text/?query=sound&token=${freesoundKey}&page_size=20&page=${page}&sort=rating_desc`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedAudios = data.results?.map(transformFreesoundAudio) || [];

      setAudios((prev) => [...prev, ...transformedAudios]);
      setTotalResults(data.count || 0);
      setCurrentPage(page);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load popular audio");
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
    clearPopularAudioCache();
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
    searchAudioAppend,
    loadPopularAudioAppend,
    clearAudio
  };
}
