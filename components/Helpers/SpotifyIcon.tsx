import React from "react";
import Image from "next/image";
import spotifyIconDark from "../../public/spotify/Spotify_Icon_RGB_Black.png";
import spotifyIconLight from "../../public/spotify/Spotify_Icon_RGB_White.png";

interface SpotifyIconProps {
  theme: string;
}

const SpotifyIcon: React.FC<SpotifyIconProps> = ({ theme }) => {
  return (
    <Image
      src={theme === "dark" ? spotifyIconDark : spotifyIconLight}
      alt="Spotify icon"
    />
  );
};
export default SpotifyIcon;
