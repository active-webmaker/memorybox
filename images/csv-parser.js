function CsvSplit(csv_file) {
  let wnum = 0;
  let bslc = "";
  let bstart = 0;
  let bend = csv_file.length - 1;
  let bnum = 0;
  let block_li = [];

  bnum = csv_file.indexOf(`"`);
  while (bnum != -1) {
    bstart = csv_file.indexOf(`"`);
    if (bstart == -1) {
      break
    }
    bend = csv_file.slice(bstart+1,csv_file.length).indexOf(`"`);
    if (bend != -1){
      bend += bstart+1
      bslc =  csv_file.slice(bstart, bend+1)
      block_li.push(bslc);
      csv_file = csv_file.replace(bslc, `{% String-${wnum} %}`)
      wnum++;
      bstart = bend+1;
    }
    else {
      break
    }
  }

  let idx_li = [`\r\n`, `\r`, `\n`];
  let idx_str = "";
  let inum;

  for (var i of idx_li) {
    inum = csv_file.indexOf(i);
    if (inum != -1) {
      idx_str = i;
      break
    }
  }
  if (idx_str == "") {
    result = [csv_file,];
  }
  else {
    result = csv_file.split(idx_str);
  }

  for (var i=0; i < result.length; i++) {
    if (result[i]=="" || result[i] == null) {
      result.splice(i,1);
    }
  }
  
  for (var i=0; i < result.length; i++) {
    result[i] = result[i].split(",");
  }

  if (bnum != -1) {
    for (var snum = 0; snum < block_li.length; snum++) {
      for (var i = 0; i < result.length; i++) {
        if (result[i]){
          let bli_idx = result[i].indexOf(`{% String-${snum} %}`);
          if (bli_idx != -1) {
            result[i][bli_idx] = block_li[snum];
            break;
          }
        }
      }
    }
  }
  return result;
}
