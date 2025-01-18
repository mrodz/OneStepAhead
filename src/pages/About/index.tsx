import { useEffect, useState } from "react";
import "./index.sass";
import "./media.sass";

import TEAM_DATA from "./members.json"

function getCompressedPath(personNameNoSpaces: string): string {
  return `Headshots/compressed/${personNameNoSpaces}.jpg`;
}

function BlurryPhoto(props: {
  personNameNoSpaces: string;
  lazy?: boolean;
  leadership: boolean;
}) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // the styles for pulsating loading do not work on iOS for some reason
  const [loaded, setLoaded] = useState(iOS);

  const optionalProperties: any = {};

  if (!loaded) {
    optionalProperties["style"] = {
      backgroundImage: `url(${getCompressedPath(props.personNameNoSpaces)})`,
    };
  }

  if (props.leadership) {
    optionalProperties["data-leadership"] = true;
  }

  return (
    <div
      className={`BlurryPhoto ${loaded ? "BlurryPhoto__loaded" : ""}`}
      {...optionalProperties}
    >
      <img
        {...(!!props.lazy ? { loading: "lazy" } : {})}
        onLoad={() => setLoaded(true)}
        src={`Headshots/${props.personNameNoSpaces}.jpg`}
        alt={`${props.personNameNoSpaces}'s headshot`}
      />
    </div>
  );
}

interface TeamCardActive {

}

interface TeamCardProps {
  name: string;
  role: string;
  leadership?: number;
  active?: TeamCardActive;
}

function TeamCard(props: TeamCardProps & { lazy: boolean }) {
  return (
    <div
      className="TeamCard"
      {...(props.leadership ? { "data-leadership": props.leadership } : {})}
    >
      <BlurryPhoto
        lazy={props.lazy}
        leadership={!!props.leadership}
        personNameNoSpaces={props.name.replaceAll(" ", "")}
      ></BlurryPhoto>
      <div className="TeamCard__text">
        <h2>{props.name}</h2>
        <h3>{props.role}</h3>
      </div>
    </div>
  );
}

export default function About() {
  useEffect(() => {
    const images = [];

    for (let card of TEAM_DATA) {
      const img = new Image();
      img.src = getCompressedPath(card.name.replaceAll(" ", ""));
      images.push(img);
    }
  });

  return (
    <main id="About">
      <h1>About Us</h1>

      <section id="About__group-photo">
        <img alt="school club yearbook snapshot" src="/clubpicture.jpg" />
      </section>

      <section id="About__description">
        One Step Ahead Culver City was founded in 2023 by Culver City High
        School students and has remained a student-led, student-run
        organization. Every member of our team mentors for our program in
        addition to any of their additional leadership or organizational
        responsibilities.
      </section>

      <section id="About__leadership">
        <h3 style={{ fontSize: "200%" }}>Leadership</h3>
        {TEAM_DATA.filter((prop) => prop.leadership !== undefined)
          .sort((a, b) => b.leadership! - a.leadership!)
          .map((props) => (
            <TeamCard
              lazy
              key={`TEAM_CARD_${props.name}`}
              {...props}
            ></TeamCard>
          ))}
      </section>

      <section id="About__photo-wrapper">
        <h3 style={{ fontSize: "200%" }}>Mentors</h3>
        {TEAM_DATA.filter((prop) => prop.leadership === undefined)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((props) => (
            <TeamCard
              lazy
              key={`TEAM_CARD_${props.name}`}
              {...props}
            ></TeamCard>
          ))}
      </section>
    </main>
  );
}
