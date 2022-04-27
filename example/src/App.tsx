import * as React from 'react';

import { VideoPlayer } from './components/videoplayer/VideoPlayer';
import type { PlayerConfiguration } from 'react-native-theoplayer';

const playerConfig: PlayerConfiguration = {
  license: 'sZP7IYe6T6fc3DX10Lfr36kg3QI1FSaoTDB-Tu1l0Zz_CSbt0SfZTDC_3ub6FOPlUY3zWokgbgjNIOf9flbrISRrTDatFS46CLa-3uai3Zz_ISggFSxg3ShoIu0kTQBz3ZfVfK4_bQgZCYxNWoryIQXzImf90SCk0Sbz3uRi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lar3leZ3Leo3SbkFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfKgqbZPUFOPLIDreYog-bwPgbt3NWo_6TGxZUD4j', //'insert THEOplayer license here'
  chromeless: true,
};

export default function App() {
  return <VideoPlayer config={playerConfig} />;
}
