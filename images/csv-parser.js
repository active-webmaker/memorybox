function CsvSplit(csv_file) {
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

  let bstart = 0;
  let bend = csv_file.length - 1;
  let bnum = 0;

  // 큰따옴표 1개

  let wnum = 0;
  let bslc = "";
  let cbslc = "";
  let block_li = [];
  bstart = 0;
  bend = csv_file.length;
  bnum = csv_file.indexOf(`"`);

  while (bnum != -1) {
    let xwnum = 0;
    bstart = csv_file.indexOf(`"`);
    if (bstart == -1) {
      break
    }
    if (csv_file.slice(bstart,bstart+2) == `""`) {
      if (csv_file[bstart+2] == `"`) {
        let xnum = 1;
        while (xnum != -1) {
          if (csv_file[bstart+2+xnum] == `"`) {
            xnum++
          }
          else {
            if (xnum % 2 == 0) {
              csv_file = csv_file.slice(0,bstart)
                + csv_file.slice(bstart, bstart+2+xnum).replaceAll(`""`,`&#34;`)
                + csv_file.slice(bstart+2+xnum);
              xwnum = -1
              break
            }
            else {
              csv_file = csv_file.slice(0,bstart+1)
                + csv_file.slice(bstart+1, bstart+2+xnum).replaceAll(`""`,`&#34;`)
                + csv_file.slice(bstart+2+xnum);
              xwnum = -1
              break
            }
          }
        }
      }
      else {
        csv_file = csv_file.slice(0,bstart)
          + `&#34;` + csv_file.slice(bstart+2);
        xwnum = -1
      }
    }
    if (xwnum == -1) {
      continue
    }

    slc_num = bstart+1;
    bend = csv_file.slice(slc_num).indexOf(`"`);

    while (bend != -1) {
      if (slc_num > csv_file.length) {
        break
      }
      bend = csv_file.slice(slc_num).indexOf(`"`);
      if (bend != -1) {
        bend += slc_num
        if (csv_file[bend+1] == `"`) {
          csv_file = csv_file.slice(0,bend) + `&#34;`
            + csv_file.slice(bend+2);
          slc_num = bend+5;
        }
        else {
          bslc = csv_file.slice(bstart, bend+1)
          cbslc = bslc.slice(1, bslc.length-1)
          for (i of idx_li) {
            cbslc = cbslc.replaceAll(i, "<p></p>")
          }
          block_li[wnum] = cbslc;
            csv_file = csv_file.replace(bslc, `{% String-${wnum} %}`)
          wnum++;
          break
        }
      }
      else {
        break
      }
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
