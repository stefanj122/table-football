function calculateSingle(single) {
  const result = {};
  for (const res of single) {
    const score = res.result.split(':');
    if (result[res.playerOne]) {
      result[res.playerOne].totalGames++;
    } else {
      result[res.playerOne] = {};
      result[res.playerOne].totalGames = 1;
      result[res.playerOne].wins = 0;
      result[res.playerOne].lost = 0;
      result[res.playerOne].id = res.player_one;
    }
    if (result[res.playerTwo]) {
      result[res.playerTwo].totalGames++;
    } else {
      result[res.playerTwo] = {};
      result[res.playerTwo].totalGames = 1;
      result[res.playerTwo].wins = 0;
      result[res.playerTwo].lost = 0;
      result[res.playerTwo].id = res.player_two;
    }
    if (score[0] > score[1]) {
      result[res.playerOne].wins++;
      result[res.playerTwo].lost++;
    } else {
      result[res.playerTwo].wins++;
      result[res.playerOne].lost++;
    }
  }
  const arr = [];
  for (const name in result) {
    arr.push({
      ...result[name],
      name,
      score: (result[name].wins * 2 - result[name].lost).toFixed(0),
    });
  }
  arr.sort((a, b) => {
    return b.score - a.score;
  });
  return arr;
}

module.exports = calculateSingle;
