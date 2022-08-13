import type { NextPage } from "next";
import communityStyles from "../styles/community.module.css";
import Head from "next/head";
import Link from "next/link";
import { FiExternalLink, FiTwitter } from "react-icons/fi";
import { TbBrandDiscord, TbBrandReddit } from "react-icons/tb";

interface communityProps {}

const Community: NextPage<communityProps> = ({}) => {
  return (
    <div className={communityStyles["community-page-root"]}>
      <Head>
        <title>community</title>
      </Head>
      <div className={communityStyles["community-page-section-title"]}>
        <h1>community</h1>
      </div>
      <div className={communityStyles["community-page-section"]}>
        <h2>connect with our community on social media.</h2>
        <div className={communityStyles["community-page-community-links-fc"]}>
          <div className={communityStyles["community-page-community-link"]}>
            <div className={communityStyles["community-page-community-link-left"]}>
              <FiTwitter />
            </div>
            <Link href="https://twitter.com">
              <div className={communityStyles["community-page-community-link-right"]}>
                <FiExternalLink />
              </div>
            </Link>
          </div>
          <div className={communityStyles["community-page-community-link"]}>
            <div className={communityStyles["community-page-community-link-left"]}>
              <TbBrandDiscord />
            </div>
            <Link href="https://discord.com">
              <div className={communityStyles["community-page-community-link-right"]}>
                <FiExternalLink />
              </div>
            </Link>
          </div>
          <div className={communityStyles["community-page-community-link"]}>
            <div className={communityStyles["community-page-community-link-left"]}>
              <TbBrandReddit />
            </div>
            <Link href="https://reddit.com">
              <div className={communityStyles["community-page-community-link-right"]}>
                <FiExternalLink />
              </div>
            </Link>
          </div>
        </div>
        <p>
          start a discussion, share your opinions and become a part of the
          remaster community. we look forward to hearing from you. if there are
          any concerns or you would like to report an issue, you can can get in
          touch with us at:{" "}
          <a href="mailto:remaster@acme.ca">remaster@acme.ca</a>
        </p>
      </div>
    </div>
  );
};
export default Community;
