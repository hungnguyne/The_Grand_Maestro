/**
 * Service to interact with MusicBrainz API
 * Documentation: https://musicbrainz.org/doc/MusicBrainz_API
 */

const BASE_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'TheGrandMaestro/1.0.0 ( hungvir@gmail.com )';

export interface MusicBrainzSuggestion {
  id: string;
  name: string;
  type?: string;
  disambiguation?: string;
}

/**
 * Search for artists (useful for Music Taste)
 */
export async function searchArtists(query: string): Promise<MusicBrainzSuggestion[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/artist?query=${encodeURIComponent(query)}&fmt=json&limit=5`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );

    if (!response.ok) throw new Error('MusicBrainz API error');

    const data = await response.json();
    return (data.artists || []).map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      type: 'Artist',
      disambiguation: artist.disambiguation,
    }));
  } catch (error) {
    console.error('Error fetching from MusicBrainz:', error);
    return [];
  }
}

/**
 * Search for instruments (can be used for some equipment types)
 */
export async function searchInstruments(query: string): Promise<MusicBrainzSuggestion[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/instrument?query=${encodeURIComponent(query)}&fmt=json&limit=5`,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );

    if (!response.ok) throw new Error('MusicBrainz API error');

    const data = await response.json();
    return (data.instruments || []).map((inst: any) => ({
      id: inst.id,
      name: inst.name,
      type: 'Instrument',
      disambiguation: inst.description,
    }));
  } catch (error) {
    console.error('Error fetching from MusicBrainz:', error);
    return [];
  }
}
