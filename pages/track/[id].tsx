import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import Image from "next/image";
import { createUrqlClient } from "../../utils/createUrqlClient";
import trackAnalysisStyles from "../../styles/Track.module.css";
import Void from "../../components/Helpers/Void";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-toward.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface trackAnalysisProps {
}

const TrackAnalysis: NextPage<trackAnalysisProps> = ({}) => {
  const router = useRouter();

  const getTime = (ms: number) => {
    const d = new Date(1000 * Math.round(ms / 1000));
    const pad = (i: number) => {
      return ("0" + i).slice(-2);
    };
    return pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
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

  return <div>hello</div>
};

TrackAnalysis.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: true })(TrackAnalysis);
