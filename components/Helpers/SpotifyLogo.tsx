import React from "react";
import Image from "next/image";
import spotifyLogoDark from "../../public/spotify/Spotify_Logo_RGB_Black.png";
import spotifyLogoLight from "../../public/spotify/Spotify_Logo_RGB_White.png";

interface SpotifyLogoProps {
  theme: string;
}

const SpotifyLogo: React.FC<SpotifyLogoProps> = ({ theme }) => {
  return (
    <Image
      src={theme === "dark" ? spotifyLogoDark : spotifyLogoLight}
      alt="Spotify logo"
      objectFit="contain"
      layout="fill"
    />
  );
};
export default SpotifyLogo;
