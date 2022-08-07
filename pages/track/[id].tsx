import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import Image from "next/image";
import { useSpotifyTrackAnalysisQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import trackAnalysisStyles from "../../styles/Track.module.css";
import Void from "../../components/Helpers/Void";
import ScaleDiagram from "../../components/Helpers/ScaleDiagram";
import SpotifyLogo from "../../components/Helpers/SpotifyLogo";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-toward.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiShare } from "react-icons/fi";

interface trackAnalysisProps {
  id: string;
}

const TrackAnalysis: NextPage<trackAnalysisProps> = ({ id }) => {
  const router = useRouter();
  const [{ data }] = useSpotifyTrackAnalysisQuery({
    variables: { spotifyTrackAnalysisId: id },
  });

  const getTime = (ms: number) => {
    const d = new Date(1000 * Math.round(ms / 1000));
    const pad = (i: number) => {
      return ("0" + i).slice(-2);
    };
    return pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
  };

  const mode: { [key: number]: string } = {
    0: "Minor",
    1: "Major",
  };

  const relativeMinor: { [key: number]: string } = {
    0: "A",
    1: "A#/Bb",
    2: "B",
    3: "C",
    4: "C#/Db",
    5: "D",
    6: "D#/Eb",
    7: "E",
    8: "F",
    9: "F#/Gb",
    10: "G",
    11: "G#/Ab",
  };

  const relativeMajor: { [key: number]: string } = {
    0: "D#/Eb",
    1: "E",
    2: "F",
    3: "F#/Gb",
    4: "G",
    5: "G#/Ab",
    6: "A",
    7: "A#/Bb",
    8: "B",
    9: "C",
    10: "C#/Db",
    11: "D",
  };

  const pitchClass: { [key: number]: string } = {
    0: "C",
    1: "C#/Db",
    2: "D",
    3: "D#/Eb",
    4: "E",
    5: "F",
    6: "F#/Gb",
    7: "G",
    8: "G#/Ab",
    9: "A",
    10: "A#/Bb",
    11: "B",
  };

  const majorDegrees: { [key: number]: string[] } = {
    0: ["C", "D", "E", "F", "G", "A", "B"],
    1: ["C#/Db", "D#/Eb", "F", "F#/Gb", "G#/Ab", "A#/Bb", "C"],
    2: ["D", "E", "F#/Gb", "G", "A", "B", "C#/Db"],
    3: ["D#/Eb", "F", "G", "G#/Ab", "A#/Bb", "C#/Db", "D"],
    4: ["E", "F#/Gb", "G#/Ab", "A", "B", "C#/Db", "D#/Eb"],
    5: ["F", "G", "A", "A#/Bb", "C", "D", "E"],
    6: ["F#/Gb", "G#/Ab", "A#/Bb", "B", "C#/Db", "D#/Eb", "F"],
    7: ["G", "A", "B", "C", "D", "E", "F#/Gb"],
    8: ["G#/Ab", "A#/Bb", "C", "C#/Db", "D#/Eb", "F", "G"],
    9: ["A", "B", "C#/Db", "D", "E", "F#/Gb", "G#/Ab"],
    10: ["A#/Bb", "C", "D", "D#/Eb", "F", "G", "A"],
    11: ["B", "C#/Db", "D#/Eb", "E", "F#/Gb", "G#/Ab", "A#/Bb"],
  };

  const minorDegrees: { [key: number]: string[] } = {
    0: ["C", "D", "D#/Eb", "F", "G", "G#/Ab", "A#/Bb"],
    1: ["C#/Db", "D#/Eb", "E", "F#/Gb", "G#/Ab", "A", "B"],
    2: ["D", "E", "F", "G", "A", "A#/Bb", "C"],
    3: ["D#/Eb", "F", "F#/Gb", "G#/Ab", "A#/Bb", "B", "C#/Db"],
    4: ["E", "F#/Gb", "G", "A", "B", "C", "D"],
    5: ["F", "G", "G#/Ab", "A#/Bb", "C", "C#/Db", "D#/Eb"],
    6: ["F#/Gb", "G#/Ab", "A", "B", "C#/Db", "D", "E"],
    7: ["G", "A", "A#/Bb", "C", "D", "D#/Eb", "F"],
    8: ["G#/Ab", "A#/Bb", "B", "C#/Db", "D#/Eb", "E", "F#/Gb"],
    9: ["A", "B", "C", "D", "E", "F", "G"],
    10: ["A#/Bb", "C", "C#/Db", "D#/Eb", "F", "F#/Gb", "G#/Ab"],
    11: ["B", "C#/Db", "D", "E", "F#/Gb", "G", "A"],
  };

  const nameContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const artistsContainerRef = useRef<HTMLDivElement>(null);
  const artistsRef = useRef<HTMLHeadingElement>(null);
  const [nameIsAnim, setNameIsAnim] = useState(false);
  const [artistsIsAnim, setArtistsIsAnim] = useState(false);

  const resetScrollText = (text: HTMLHeadingElement) => {
      text.style.transition = "0.5s";
      text.style.transform = "translateX(0px)";
  };

  const scrollText = (text: HTMLHeadingElement, container: HTMLDivElement) => {
    if (text.offsetWidth > container.offsetWidth) {
      text.style.transition = `${(text.offsetWidth - container.offsetWidth)/100}s linear`;
      text.style.transform = `translateX(${
        container.offsetWidth - text.offsetWidth
      }px)`;
    }
  };

  useEffect(() => {
    let resetArtistsScroll: NodeJS.Timeout;
    let refreshArtistsScroll: NodeJS.Timeout;

    if (!artistsIsAnim) {
      resetArtistsScroll = setTimeout(() => {
        if (artistsRef.current) {
          resetScrollText(artistsRef.current);
        }
      }, 2000)
      refreshArtistsScroll = setTimeout(() => {
        if (artistsRef.current && artistsContainerRef.current) {
          setArtistsIsAnim(true);
          scrollText(artistsRef.current, artistsContainerRef.current);
        }
      }, 10000);
    }

    return () => {
      clearTimeout(resetArtistsScroll);
      clearTimeout(refreshArtistsScroll);
    }
    
  }, [artistsIsAnim])
  

  useEffect(() => {
    let resetNameScroll: NodeJS.Timeout;
    let refreshNameScroll: NodeJS.Timeout;

    if (!nameIsAnim) {
      resetNameScroll = setTimeout(() => {
        if (nameRef.current) {
          resetScrollText(nameRef.current);
        }
      }, 2000)
      refreshNameScroll = setTimeout(() => {
        if (nameRef.current && nameContainerRef.current) {
          setNameIsAnim(true);
          scrollText(nameRef.current, nameContainerRef.current);
        }
      }, 10000);
    }

    return () => {
      clearTimeout(resetNameScroll);
      clearTimeout(refreshNameScroll);
    }
  }, [nameIsAnim]);

  useEffect(() => {
    const initialScroll = setTimeout(() => {
      if (nameRef.current && nameContainerRef.current && artistsRef.current && artistsContainerRef.current) {
        setNameIsAnim(true);
        scrollText(nameRef.current, nameContainerRef.current);
        setArtistsIsAnim(true);
        scrollText(artistsRef.current, artistsContainerRef.current);
      }
    }, 5000);

    return () => {
      clearTimeout(initialScroll);
    };
  }, []);

  return data?.spotifyTrackAnalysis ? (
    <div className={trackAnalysisStyles["track-analysis-page-root"]}>
      <Head>
        <title>
          Analysis of {data?.spotifyTrackAnalysis.name} by{" "}
          {data?.spotifyTrackAnalysis.artists[0]}
        </title>
      </Head>
      <div className={trackAnalysisStyles["track-analysis-info-fc"]}>
        <div className={trackAnalysisStyles["track-analysis-primary-fc"]}>
          <div className={trackAnalysisStyles["track-analysis-primary-image"]}>
            <Image
              src={data?.spotifyTrackAnalysis.albumArt as string}
              alt={data?.spotifyTrackAnalysis.name}
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div
            className={trackAnalysisStyles["track-analysis-primary-details-fc"]}
          >
            <div
              ref={nameContainerRef}
              className={
                trackAnalysisStyles["track-analysis-primary-details-name"]
              }
            >
              <h1 onTransitionEnd={() => setNameIsAnim(false)} ref={nameRef}>
                {data?.spotifyTrackAnalysis.name}
              </h1>
            </div>
            <div
              ref={artistsContainerRef}
              className={
                trackAnalysisStyles["track-analysis-primary-details-artists"]
              }
            >
              <h2 onTransitionEnd={() => setArtistsIsAnim(false)} ref={artistsRef}>{data?.spotifyTrackAnalysis.artists.join(", ")}</h2>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-primary-scale-fc"]}
            >
              <ScaleDiagram
                scale={
                  data?.spotifyTrackAnalysis.mode === 0
                    ? minorDegrees[data?.spotifyTrackAnalysis.key]
                    : majorDegrees[data?.spotifyTrackAnalysis.key]
                }
              />
            </div>
          </div>
        </div>
        <div className={trackAnalysisStyles["track-analysis-secondary-fc"]}>
          <div
            className={
              trackAnalysisStyles["track-analysis-secondary-details-fc"]
            }
          >
            <div
              className={trackAnalysisStyles["track-analysis-secondary-detail"]}
            >
              <h3>duration</h3>
              <p>
                {getTime(data?.spotifyTrackAnalysis.duration)} <br /> Minutes
              </p>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-secondary-detail"]}
            >
              <h3>key</h3>
              <p>
                {pitchClass[data?.spotifyTrackAnalysis.key]} <br />
                {mode[data?.spotifyTrackAnalysis.mode]}
              </p>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-secondary-detail"]}
            >
              <h3>
                relative{" "}
                {data?.spotifyTrackAnalysis.mode === 0 ? "major" : "minor"}
              </h3>
              <p>
                {data?.spotifyTrackAnalysis.mode === 0
                  ? relativeMajor[data?.spotifyTrackAnalysis.key]
                  : relativeMinor[data?.spotifyTrackAnalysis.key]}
                <br />
                {data?.spotifyTrackAnalysis.mode === 0 ? "Major" : "Minor"}
              </p>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-secondary-detail"]}
            >
              <h3>tempo</h3>
              <p>
                {Math.round(data?.spotifyTrackAnalysis.tempo)} <br /> BPM
              </p>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-secondary-detail"]}
            >
              <h3>time signature</h3>
              <p>
                {data?.spotifyTrackAnalysis.time_sig}/4 <br /> Time
              </p>
            </div>
          </div>
          <div
            className={
              trackAnalysisStyles["track-analysis-secondary-actions-fc"]
            }
          >
            <div
              className={
                trackAnalysisStyles["track-analysis-secondary-actions"]
              }
            >
              <Link href={"/editor/new?track=" + id}>
                <div>
                  <a>create remaster</a>
                </div>
              </Link>
              <Tippy
                className={trackAnalysisStyles["tooltip"]}
                trigger="click"
                content="copied!"
              >
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "https://www.remaster.com" + router.asPath
                    );
                  }}
                >
                  <FiShare />
                </div>
              </Tippy>
            </div>
            <div
              className={trackAnalysisStyles["track-analysis-secondary-attr"]}
            >
              <Link href={"https://open.spotify.com/track/" + id}>
                <div
                  className={
                    trackAnalysisStyles["track-analysis-spotify-button"]
                  }
                >
                  <p>[content being displayed]</p>{" "}
                  <div
                    className={
                      trackAnalysisStyles["track-analysis-spotify-logo"]
                    }
                  >
                    <SpotifyLogo theme="light" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Void>{}</Void>
      <div className={trackAnalysisStyles["track-analysis-remasters-fc"]}></div>
    </div>
  ) : (
    <></>
  );
};

TrackAnalysis.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: true })(TrackAnalysis);
