import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { SpotifyAlbum, SpotifyTrack } from "../../generated/graphql";
import SpotifyIcon from "../Helpers/SpotifyIcon";
import spotifyCardStyles from "./SpotifyCard.module.css";

interface SpotifyCardProps {
  track?: SpotifyTrack;
  album?: SpotifyAlbum;
}

const SpotifyCard: React.FC<SpotifyCardProps> = ({ track, album }) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      {track ? (
        <Link href={"./track/" + track.id}>
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={spotifyCardStyles["spotify-card-root"]}
          >
            <div className={spotifyCardStyles["spotify-card-image-fc"]}>
              <Image
                src={track.albumArt}
                alt={track.name}
                width={640}
                height={640}
                layout="responsive"
              />
            </div>
            <div className={spotifyCardStyles["spotify-card-content-fc"]}>
              <div className={spotifyCardStyles["spotify-card-content-top-fc"]}>
                <h1>{track.name}</h1>
              </div>
              <div
                className={spotifyCardStyles["spotify-card-content-bottom-fc"]}
              >
                <div
                  className={
                    spotifyCardStyles["spotify-card-content-spotify-icon"]
                  }
                >
                  <SpotifyIcon theme={hover ? "light" : "dark"} />
                </div>
                <h2>{track.artists[0]}</h2>
              </div>
            </div>
          </div>
        </Link>
      ) : album ? (
        <Link href={"./album/" + album.id}>
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={spotifyCardStyles["spotify-card-root"]}
          >
            <div className={spotifyCardStyles["spotify-card-image-fc"]}>
              <Image
                src={album.albumArt}
                alt={album.name}
                width={640}
                height={640}
                layout="responsive"
              />
            </div>
            <div className={spotifyCardStyles["spotify-card-content-fc"]}>
              <div className={spotifyCardStyles["spotify-card-content-top-fc"]}>
                <h1>{album.name}</h1>
              </div>
              <div
                className={spotifyCardStyles["spotify-card-content-bottom-fc"]}
              >
                <div
                  className={
                    spotifyCardStyles["spotify-card-content-spotify-icon"]
                  }
                >
                  <SpotifyIcon theme={hover ? "light" : "dark"} />
                </div>
                <h2>{album.artists[0]}</h2>
              </div>
            </div>
          </div>
        </Link>
      ) : null}
    </>
  );
};
export default SpotifyCard;
