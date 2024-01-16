function calculateUserScore(single, id) {
  const result = { win: 0, lost: 0, total: 0 };
  for (const res of single) {
    const score = res.result.split(':');
    if (+score[0] > +score[1]) {
      if(res.to_player_one == id || res.to_player_two == id){
        result.win++;
      }else{
        result.lost++
      }
    } else {
      if(res.to_player_one == id || res.to_player_two == id){
        result.lost++
      }else{
        result.win++;
      }
    }
    result.total++;
  }
  return result;
}

module.exports = calculateUserScore;
