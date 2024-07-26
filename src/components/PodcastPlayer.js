// components/PodcastPlayer.js
import React from 'react';

export default function PodcastPlayer({ url }) {
  return (
    <audio controls>
      <source src={url} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}