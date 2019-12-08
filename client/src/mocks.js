export const tracksForSpotifyPlaylistMock = [
  {
    artists: [{ name: "test artist 1" }],
    name: "test name 1",
    id: 1
  },
  {
    artists: [{ name: "test artist 2" }],
    name: "test name 2",
    id: 2
  }
];
export const tracksFromJunoMock = [
  {
    junoResult: { artist: "test artist 1", artist: "test title 1" },
    spotifyResult: {
      spotifyTracks: {
        items: [
          {
            id: 1,
            name: "test name 1",
            preview_url: "www.preview.com"
          }
        ]
      }
    }
  },
  {
    junoResult: { artist: "test artist 1", artist: "test title 1" },
    spotifyResult: {
      spotifyTracks: {
        items: [
          {
            id: 1,
            name: "test name 1",
            preview_url: "www.preview.com"
          }
        ]
      }
    }
  }
];
