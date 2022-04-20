import * as React from 'react';

import { VideoPlayer } from './components/videoplayer/VideoPlayer';
import type { PlayerConfiguration } from 'react-native-theoplayer';

const playerConfig: PlayerConfiguration = {
  license: 'sZP7IYe6T6PeTSft3uAKImziID4eFSx1TSR-CSP6C6zL3Sg6CKh_0LAgCL06FOPlUY3zWokgbgjNIOf9flbrISRrTDatFS46CLa-3uai3Zz_ISggFSxg3ShoIu0kTQBz3ZfVfK4_bQgZCYxNWoryIQXzImf90SCk0Sbz3uRi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lhi3uBoTufr0L5iFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfKXpIwPqdDa6Ymi6bo4pIXjNWYAZIY3LdDjpflNzbG4gya', //'insert THEOplayer license here'
  chromeless: true,
};

export default function App() {
  return <VideoPlayer config={playerConfig} />;
}
