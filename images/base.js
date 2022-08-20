// csv 파일 임포트 및 파싱 함수
function Dload(){
  let data_csv = $("#data-csv").prop("files")[0];
  let file_data = new FileReader();
  file_data.readAsText(data_csv, "EUC-KR");
  let ond = false;
  file_data.onload = () => {
    let f_str = file_data.result.toString();
    let f_split = f_str.split("\r\n");
    // csv 파일 제목, 메뉴, 내용 분리
    ttl = f_split[0].split(',')[0];
    head_li = f_split[1].split(',');
    con_li = f_split.slice(2, f_split.length);
    for (i = 0; i < con_li.length; i++){
      if (!con_li[i]) {
        con_li.splice(i, 1);
      }
      else {
        con_li[i] = con_li[i].split(",");
      }
    }

    // 데이터 내용(콘텐츠) 1차 필터 목록에 할당
    ftr_obj1 = con_li;
    ftr_res1.clear()
    for(con of con_li) {
      ftr_res1.add(con[0]);
    }

    // 데이터 제목 내용 HTML 상에 반영 & 타이틀 이미지 변경
    $("#title-part span").html(ttl);
    $("#title-part img").attr("src" ,`.\\img\\light_150.png`);

    // HTML 상에 1차 필터 메뉴 반영하기
    let ftr_con1 = '<option></option>\n<option>전체</option>\n<option>'
                + [...ftr_res1].join("</option>\n<option>")+'</option>';
    $("#clmenu-1").html(ftr_con1);

    // HTML 상에 필터 메뉴 보이기
    $("#option-menu").removeClass("hidden");
    $("#btn-ophide").removeClass("hidden");

    // HTML 상에 콘텐츠 파트 숨기기
    $("#page-wh").addClass("hidden");
    $("#srch-wh").addClass("hidden");
    $("#content-wh").addClass("hidden");
    $("#srch-sg").addClass("hidden");
    $("#content-sg").addClass("hidden");

    // HTML 상의 중요도 필터에 리스트 반영하기
    let lv_li = [];
    for (let con of con_li) { lv_li.push(con[8]); }
    lv_sort = lv_li.sort((a,b) => {
      if (a < b) { return -1 }
      else if (a > b) {return 1}
      else { return 0 }
    });
    lv_li = new Set(lv_sort);
    html_lv = '<option></option>\n<option>전체</option>\n<option>'
      + [...lv_li].join("</option>\n<option>") + '</option>';
    $("#level-sg select").html(html_lv);
    $("#level-wh select").html(html_lv);
  }
}

// 필터함수
function FtrList(idx_num, obj_arr, obj_nxt, res_nxt) {
  // 현재 목록 및 다음 목록 변수 선언하기
  let obj_li = [ftr_obj1, ftr_obj2, ftr_obj3, ftr_obj4, ftr_objfn];
  let res_li = [ftr_res1, ftr_res2, ftr_res3, ftr_res4, ftr_resfn];

  // 데이터 컬럼 유지 상태에서 필터링
  let clfil = $('#clmenu-'+idx_num).val();
  let ftr;
  if (clfil != "전체"){
    ftr = obj_arr.filter((item, index, source)=>{
      let result = (item[idx_num-1] == clfil);
      return result;
    });
  } else {
    ftr = obj_arr;
  }

  // 중요도(레벨) 변경시 리스트 백업
  if (idx_num == 4) {
    ftr_objsv = ftr;
  }

  // 다음 목록 배열 초기화
  for (let i=idx_num; i < 5; i++) {
    obj_li[i].splice(0);
    res_li[i].clear();
  }

  // 컬럼 유지 한 채 필터링한 배열 다음 목록으로 내보내기
  for (let f of ftr) { obj_nxt.push(f); }

  // 컬럼 제거한 배열 다음 목록으로 내보내기
  for (f of ftr) { res_nxt.add(f[idx_num]); }

  // 컬럼 제거한 다음 목록 HTML 화면에 반영하기
  for (let i=idx_num+1; i <= 4; i++) {
    let html_val;
    if (i == idx_num+1) {
      html_val = "<option></option>\n<option>전체</option>\n<option>"
        + [...res_nxt].sort().join("</option>\n<option>") + "</option>"
    } else {
      html_val = "<option selected></option>"
    }
    $("#clmenu-"+i).html(html_val);
  }
}

// 필터링 메뉴 전환 토글 함수
function NavToggle(id1, id2) {
  let id3;
  let id4;
  if (id1 == "wnav"){
    id3 = "whole-panel";
    id4 = "single-panel";
  } else {
    id3 = "single-panel";
    id4 = "whole-panel";
  }
  $('#' + id1).removeClass('active');
  $('#' + id2).removeClass('active');
  $('#' + id1).addClass('active');
  $('#' + id3).addClass('hidden');
  $('#' + id4).addClass('hidden');
  $('#' + id3).removeClass('hidden');
}

// 싱글뷰 관련 인덱스 점프(다음 인덱스 콘텐츠 보기 기능) 함수
function JmpCon(index) {
  let idx_num = ftr_idx_num + index;
  if (idx_num < 0) {
    alert("첫 페이지입니다.");
  }
  else if (html_method && (html_frame != "html")){
    if (ftr_for_num == 0) {
      ftr_idx_num = idx_num-1;
      NxtCon(html_frame, html_method, 0);
    }
    else {
      ftr_idx_num = idx_num;
      NxtCon(html_frame, html_method, 0);
    }
  }
}

// 인덱스 점프 호출 버튼 함수
function JmpBtn() {
  let index = $("#srch-input").val();
  index = Number(index);
  if (ftr_idx.includes(index)){
    ftr_for_num = 1;
    ftr_idx_num = 0;
    JmpCon(index);
  }
  else {
    alert("입력하신 숫자가 현재 데이터 인덱스 범위에 없습니다. 다시 입력하세요.")
  }
}


/* 다음 콘텐츠 보기 함수 -
홀뷰(전체 보기) 함수, 싱글뷰(하나씩 보기) 함수 관련 기능 */
function NxtCon(frame, method, fornum) {
  let idx_ftr, inum;
  if (ftr_idx_num >= ftr_idx.length) {
    console.log("Nxtcon ftr_idx_num 오류")
    idx_ftr = null;
  }
  else if (ftr_idx.length > ftr_objfn.length) {
    console.log("Nxtcon ftr_idx 배열 길이 오류")
    idx_ftr = null;
  }
  else {
    inum = ftr_idx[ftr_idx_num];
    idx_ftr = ftr_objfn[inum];
  }

  html_frame = frame;
  ftr_for_num = fornum;

  if (!idx_ftr){
    alert("선택 파트 학습 종료");
  }
  else if (method == "개념우선(서술형)"){
    switch (ftr_for_num) {
      case 0:
        $("#content-sg").html(frame);
        let clt_con = idx_ftr.slice(0,4).join("/")
          + `&nbsp;<span class="fs-13 fc-gr">(인덱스: ${inum})</span>`;
        $("#cltype").html(clt_con);
        $("#definy").html(idx_ftr[4]);
        break;

      case 1:
        $("#memorize").html(idx_ftr[5]);
        break;

      case 2:
        $("#headstr").html(idx_ftr[6]);
        break;

      case 3:
        $("#desc").html(idx_ftr[7]);
        $("#lvcon").html(idx_ftr[8]);
        $("#source").html(idx_ftr[9]);
        ftr_idx_num += 1;
        break;
    }
  }
  else if (method == "설명우선(단답형)") {
    switch (ftr_for_num) {
      case 0:
        $("#content-sg").html(frame);
        let clt_con = idx_ftr.slice(0,4).join("/")
          + `&nbsp;<span class="fs-13 fc-gr">(인덱스: ${inum})</span>`;
        $("#cltype").html(clt_con);
        $("#desc").html(idx_ftr[7]);
        break;

      case 1:
        $("#headstr").html(idx_ftr[6]);
        break;

      case 2:
        $("#memorize").html(idx_ftr[5]);
        break;

      case 3:
        $("#definy").html(idx_ftr[4]);
        $("#lvcon").html(idx_ftr[8]);
        $("#source").html(idx_ftr[9]);
        ftr_idx_num += 1;
        break;
    }
  }

  if (idx_ftr) {
    if (ftr_for_num != 3) { ftr_for_num++; } else { ftr_for_num = 0; }
    html_frame = frame;

    let buttons =`<div class="col-lg-12"><br></div>
      <div class="col-lg-12">
        <span class="pdlr-10"><button class="btn btn-default"
        onclick="JmpCon(-1)">이전 내용</button></span>
        <span class="pdlr-10"><button class="btn btn-default"
        onclick="NxtCon(html_frame,'${method}', ${ftr_for_num})">
        계속 보기</button></span>
        <span class="pdlr-10"><button class="btn btn-default"
        onclick="JmpCon(1)">다음 내용</button></span>
      </div>
      <div class="col-lg-12"><br><br></div>`;

    $("#btnxt").html(buttons);
    document.body.querySelector("#srch-sg").scrollIntoView();
  }
}

function OperKey(e) {
  // 37,39: 왼쪽, 오른쪽 화살표 / 81, 87: Q, W
  // 65, 83, 68: A, S, D / 192: 백따옴표
  let sgbool = $("#content-sg").hasClass("hidden");
  let whbool = $("#content-wh").hasClass("hidden");

  if (!sgbool) {
    if ([37, 65, 81].includes(e.keyCode)) {
      JmpCon(-1);
    }
    else if ([39, 68, 87].includes(e.keyCode)) {
      JmpCon(1);
    }
    else if ([192, 83].includes(e.keyCode)) {
      NxtCon(html_frame, html_method, ftr_for_num);
    }
  }

  if (!whbool) {
    if (html_method && (act_pg >= 0) && (typeof(act_pg)=="number")) {
      if ([37, 81, 65].includes(e.keyCode)) {
        if (act_pg - 1 < 0) {
          alert("첫페이지입니다.");
        }
        else {
          NxtPage(act_pg-1, html_method);
        }
      }
      else if ([39, 87, 83, 68, 192].includes(e.keyCode)) {
        NxtPage(act_pg+1, html_method);
      }
    }
  }
}

// 옵션 보기 버튼 활성화 함수
function OptionShow() {
  $("#btn-opshow").addClass("hidden");
  $("#btn-ophide").removeClass("hidden");
  $("#option-menu").removeClass("hidden");
}

// 옵션 숨기기 버튼 활성화 함수
function OptionHide() {
  $("#option-menu").addClass("hidden");
  $("#btn-ophide").addClass("hidden");
  $("#btn-opshow").removeClass("hidden");
}

// 자동 보기(오토슬라이드) 중단 함수
function CldItv() {
  clearInterval(timeritv);
  console.log("CldItv 호출");
  console.log("CldItv, ftr_idx: ", ftr_idx);
  console.log("CldItv, ftr_idx_num: ", ftr_idx_num);
  console.log("CldItv, ftr_for_num: ", ftr_for_num);
  console.log("CldItv, timenum: ", timenum);
  console.log("CldItv, timelimit: ", timelimit);
  console.log("CldItv, timesum: ", timesum);
  console.log("CldItv, timeritv: ", timeritv);
}

// 자동 보기(오토슬라이드) 중단 버튼 함수
function CancelView(frame, method, time_arr) {
  CldItv();
  let buttons = `<div class="col-lg-12"><br></div><span class="pdlr-10"><button class="btn btn-default" onclick="NxtCon(html_frame, '${method}'
    , ftr_for_num)">수동 보기</button></span><span class="pdlr-10"><button class="btn btn-default" onclick="AutoSlide(
      html_frame, '${method}')">자동 보기</button></span><div class="col-lg-12"><br><br></div>`;
  $("#btnxt").html(buttons);
}

// 인터벌 보기 함수(실제 자동보기 함수 기능) - 오토슬라이드에서 호출
function ItvRepeat(method) {
  timenum++;

  if (timenum == timelimit[ftr_for_num]) {
    let casenum = 0;
    timenum = 0;

    if (method == "개념우선(서술형)"){
      casenum = ftr_for_num+10;
    }
    else if (method == "설명우선(단답형)") {
      casenum = ftr_for_num+20;
    }

    let idx_ftr = ftr_objfn[ftr_idx[ftr_idx_num]];
    let buttons =`
    <div class="col-lg-12"><br></div><button class="btn btn-default" onclick="CancelView(html_frame,
      '${method}', timelimit)">자동보기 중단</button><div class="col-lg-12"><br></div>`

    if (!idx_ftr){
      CldItv();
      alert("선택 파트 학습 종료");
    }
    else {
      switch (casenum) {
        case 10:
          $("#content-sg").html(html_frame);
          $("#btnxt").html(buttons);
          $("#cltype").html(idx_ftr.slice(0,4).join("/"));
          $("#definy").html(idx_ftr[4]);
          break;

        case 11:
          $("#memorize").html(idx_ftr[5]);
          break;

        case 12:
          $("#headstr").html(idx_ftr[6]);
          break;

        case 13:
          $("#desc").html(idx_ftr[7]);
          $("#lvcon").html(idx_ftr[8]);
          $("#source").html(idx_ftr[9]);
          break;

        case 14:
          break;

        case 20:
          $("#content-sg").html(html_frame);
          $("#btnxt").html(buttons);
          $("#cltype").html(idx_ftr.slice(0,4).join("/"));
          $("#desc").html(idx_ftr[7]);
          break;

        case 21:
          $("#headstr").html(idx_ftr[6]);
          break;

        case 22:
          $("#memorize").html(idx_ftr[5]);
          break;

        case 23:
          $("#definy").html(idx_ftr[4]);
          $("#lvcon").html(idx_ftr[8]);
          $("#source").html(idx_ftr[9]);
          break;

        case 24:
          break;
      }
      if (ftr_for_num < timelimit.length - 1) { ftr_for_num++; } else { ftr_for_num = 0 ;}

      if (ftr_for_num == 0) {
        if (ftr_idx_num < ftr_idx.length - 1) {
          ftr_idx_num++
        } else {
          CldItv();
          console.log("정상종료: 마지막 index");
          alert("선택 파트 학습 종료");
        }
      }
      document.body.querySelector("#srch-sg").scrollIntoView();
    }
  }
  else if (timenum > timelimit[ftr_for_num]) {
    console.log("error1: 카운트 초과");
    CldItv();
  }
  else if (timenum > timesum) {
    console.log("error2: 합계 초과");
    CldItv();
  }
}

// 자동 보기(오토 슬라이드) 함수 - 기본 조건만 설정 후 인터벌 함수 호출
function AutoSlide(frame, method) {
  timenum = 0;
  timesum = 0;
  for (let i = 0; i < timelimit.length; i++) { timesum += timelimit[i] }
  html_frame = frame;

  timeritv = setInterval(() => { ItvRepeat(method) }, 1000);
}

// 싱글뷰(하나씩 보기) 함수 - 필터링 내용 선언 할당 및 하위 함수 호출
function SingleView() {
  //순서대로 역순으로 랜덤
  let sort_order = $("#sort-order select").val();
  // 자동 수동
  let auto_man =  $("#auto-man select").val();
  let auto_man_time =  $("#time-set input").val().replace(" ","").split(',');
  // 보기방식
  let view_method_sg = $("#view-method-sg select").val();
  // 중요도
  let level_sg = $("#level-sg select").val();
  let rdo_sg = $('input[name=lvsgRdo]:checked').val();

  // 보기 방식 변수 전역 변수로 보내기
  html_method = view_method_sg;
  // 중요도에 따른 필터링
  if (level_sg != "전체") {
    if (rdo_sg == "include") {
      ftr_objfn = ftr_objfn.filter((item, index, source)=>{
        return (item[8] <= level_sg);
      });
    }
    else if (level_sg) {
      ftr_objfn = ftr_objfn.filter((item, index, source)=>{
        return (item[8] == level_sg);
      });
    }
  }

  let html_content = ``;

  if (view_method_sg == "개념우선(서술형)"){
    html_content +=`
      <div class="row">
        <div class="col-lg-2 col-md-1 vigible-lg-2 vigible-md-2"></div>
        <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12 fs-16">
          <div class="row bdt-1sg bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bklc-menu bdr-1sg">구분</div>
            <div class="col-lg-8 col-md-9 col-sm-9 col-xs-12 text-center pdtb-10 bklc-menu">내용</div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">분류</div>
            <div id="cltype" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10"></div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">개념</div>
            <div id="definy" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10"></div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">암기문</div>
            <div id="memorize" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">암기문</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">머릿글자</div>
            <div id="headstr" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">머릿글자</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">설명</div>
            <div id="desc" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">설명</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">중요도</div>
            <div id="lvcon" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">중요도</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">출처</div>
            <div id="source" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">출처</div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-1 vigible-lg-2 vigible-md-2"></div>
      </div>
      `
  }

  else if (view_method_sg == "설명우선(단답형)") {
    html_content +=`
      <div class="row">
        <div class="col-lg-2 col-md-1 vigible-lg-2 vigible-md-2"></div>
        <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12 fs-16">
          <div class="row bdt-1sg bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bklc-menu bdr-1sg">구분</div>
            <div class="col-lg-8 col-md-9 col-sm-9 col-xs-12 text-center pdtb-10 bklc-menu">내용</div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">분류</div>
            <div id="cltype" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10"></div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">설명</div>
            <div id="desc" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10"></div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">머릿글자</div>
            <div id="headstr" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">머릿글자</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">암기문</div>
            <div id="memorize" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">암기문</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">개념</div>
            <div id="definy" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">개념</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">중요도</div>
            <div id="lvcon" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">중요도</div>
            </div>
          </div>
          <div class="row bdb-1sg diflex">
            <div class="col-lg-4 col-md-3 col-sm-3 hidden-xs text-center pdtb-10 bkiv-menu bdr-1sg">출처</div>
            <div id="source" class="col-lg-8 col-md-9 col-sm-9 col-xs-12 pdtb-10">
              <div class="bg-cdbbk text-center">출처</div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-1 vigible-lg-2 vigible-md-2"></div>
      </div>
      `
  }
  html_content += `<br><div id="btnxt" class="row text-center"></div><br>`;
  $("#option-menu").addClass("hidden");
  $("#btn-ophide").addClass("hidden");
  $("#btn-opshow").removeClass("hidden");

  $("#content-wh").addClass("hidden");
  $("#srch-wh").addClass("hidden");
  $("#page-wh").addClass("hidden");
  $("#srch-sg").removeClass("hidden");
  $("#content-sg").removeClass("hidden");
  $("#content-sg").html(html_content);

  // 인덱스 초기화
  ftr_idx = [];
  ftr_idx_num = 0;
  ftr_for_num = 0;

  // 인덱스 할당
  for (let i = 0; i < ftr_objfn.length; i++) {
    ftr_idx.push(i);
  }

  // 정렬 순서에 따라 인덱스 재배치
  if (sort_order == "역순으로"){
    ftr_idx.reverse();
  } else if (sort_order == "랜덤"){
    ftr_idx.sort(() => { Math.random() - 0.5; });
  }

  /*
  보기방식이 자동일 경우 설정 시간 배열 초기화
  보기방식에 따라 오토슬라이드 또는 넥스트콘 함수 호출
  */
  timelimit = [1,];
  if (auto_man_time.includes(NaN)) {
    alert("시간 설정이 잘못되었습니다.")
  }
  else if (auto_man == "자동") {
    for (let i=0; i < auto_man_time.length; i++) {
      timelimit.push(Number(auto_man_time[i]))
    }

    AutoSlide(html_content, view_method_sg);
  }
  else {
    NxtCon(html_content, view_method_sg, ftr_for_num);
  }

}

function PageSrch() {
  let page = $("#srch-page").val();
  if (page > all_page || page < 1) {
    alert("존재하지 않는 페이지입니다.");
  }
  else {
    NxtPage(page-1, html_method);
  }
}

// 페이지 번호 메뉴 함수 - 홀뷰(전체 보기) 관련 기능
function PageLoad(page, method) {
  let lines = $("#lines").val();
  all_page = Math.ceil(ftr_objfn.length / lines);
  let rest_line = ftr_objfn % lines;
  let page_package = Math.ceil((page+1)/ 5);
  let page_min = page_package*5 - 4;
  let page_max = Math.min(all_page, page_package*5);
  let pg_active = "";
  let onclk = "";

  let page_prev;
  if ((page_min-5) < 1){ page_prev = 0; } else { page_prev = page_min-5; }
  let page_nxt;
  if (page_max+1 > all_page){ page_nxt = page_max; } else { page_nxt = page_max+1; }

  if (page_prev != 0) { pg_active = ""; onclk=`onclick="NxtPage(${page_prev-1},'${method}')"`;}
  else { pg_active = 'class="disabled"'; onclk="";}
  let html_page = `
      <nav>
        <ul class="pagination">
          <li ${pg_active}>
            <a href="#" aria-label="Previous" ${onclk}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>`;

  for (i = page_min; i <= page_max; i++){
    if (i-1 != page) { pg_active = ""; onclk=`onclick="NxtPage(${i-1},'${method}')"`;}
    else { pg_active = 'class="active"'; onclk="";}
    html_page += `<li ${pg_active}><a href="#" ${onclk}>${i}</a></li>`;
  }

  if (page_nxt != all_page) { pg_active = ""; onclk=`onclick="NxtPage(${page_nxt-1},'${method}')"`;}
  else { pg_active = 'class="disabled"'; onclk="";}

  html_page +=`
        <li ${pg_active}>
          <a href="#" aria-label="Next" ${onclk}>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`

  $("#page-wh").html(html_page);

  document.body.querySelector("#srch-wh").scrollIntoView();
}

// 다음 페이지 보기 함수 - 페이지 번호, 홀뷰 함수 관련 기능
function NxtPage(page, method) {
  let lines = $("#lines").val();
  all_page = Math.ceil(ftr_objfn.length / lines);
  let min_line = Math.min(ftr_objfn.length, (page+1)*lines);
  let obj_list = ftr_objfn.slice(page*lines, min_line);
  let html_menu = ``;
  act_pg = page;

  if (method == "개념우선(서술형)"){
    html_menu += `
      <div id="tb-menu" class="col-lg-12 bdt-1sg bdb-1sg pdtb-10">
        <div class="row fw-bold text-center">
          <div id="definy-m" class="col-lg-2 col-md-2 col-sm-2 hidden-xs fs-14">개념</div>
          <div id="memorize-m" class="col-lg-3 col-md-3 col-sm-3 hidden-xs fs-14">암기문</div>
          <div id="headstr-m" class="col-lg-2 col-md-2 col-sm-2 hidden-xs fs-14">머릿글자</div>
          <div id="desc-m" class="col-lg-5 col-md-5 col-sm-5 hidden-xs fs-14">설명</div>
          <div id="hd-menu1" class="col-xs-4 visible-xs fs-14">개념&nbsp;/&nbsp;머릿글자</div>
          <div id="hd-menu2" class="col-xs-8 visible-xs fs-14">암기문&nbsp;/&nbsp;설명</div>
        </div>
      </div>`;
  }
  else if (method == "설명우선(단답형)") {
    html_menu += `
      <div class="col-lg-12 bdtb-lsg">
        <div class="row">
          <div id="desc-m" class="col-lg-5 col-md-5 col-sm-5 col-xs-5 fs-16">설명</div>
          <div id="headstr-m" class="col-lg-2 col-md-2 col-sm-2 col-xs-2 fs-16">머릿글자</div>
          <div id="memorize-m" class="col-lg-2 col-md-2 col-sm-2 col-xs-2 fs-16">암기문</div>
          <div id="definy-m" class="col-lg-2 col-md-2 col-sm-2 col-xs-2 fs-16">개념</div>
          <div id="lvcon-m" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 fs-13">중요/출처</div>
        </div>
      </div>`;
  }
  let html_content = html_menu;

  for (let i = 0; i < obj_list.length; i++) {
    let ix = ftr_objfn.indexOf(obj_list[i]);
    if (method == "개념우선(서술형)"){
      html_content += `
        <div class="col-lg-12 bdb-1sg pdtb-10">
          <div class="row">
            <div id="definy-${ix}" class="col-lg-2 col-md-2 col-sm-2 col-xs-4 fs-14">${ix}.&nbsp;${obj_list[i][4]}</div>
            <div id="memorize-${ix}" class="col-lg-3 col-md-3 col-sm-3 col-xs-8 fs-14">${obj_list[i][5]}</div>
            <div class="col-xs-12 visible-xs"><br><br></div>
            <div id="headstr-${ix}" class="col-lg-2 col-md-2 col-sm-2 col-xs-4 fs-14">${obj_list[i][6]}</div>
            <div id="desc-${ix}" class="col-lg-5 col-md-5 col-sm-5 col-xs-8 fs-14">${obj_list[i][7]}</div>
            <div id="cltype-${ix}" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdt-10">
              <span class="fs-12 fc-gr text-right">${obj_list[i].slice(0,4).join("/")}</span>
              <span id="lvcon-${ix}" class="fs-12 fc-gr text-left">&nbsp;(중요도:&nbsp;${obj_list[i][8]}&nbsp;/&nbsp;출처:&nbsp;${obj_list[i][9]})</span>
            </div>
          </div>
        </div>`;
    }
    else if (method == "설명우선(단답형)") {
      html_content += `
        <div class="col-lg-12 bdb-1sg pdtb-10">
          <div class="row">
            <div id="desc-${ix}" class="col-lg-5 col-md-5 col-sm-5 col-xs-8 fs-14">${ix}.&nbsp;${obj_list[i][7]}</div>
            <div id="headstr-${ix}" class="col-lg-2 col-md-2 col-sm-2 col-xs-4 fs-14">${obj_list[i][6]}</div>
            <div class="col-xs-12 visible-xs"><br><br></div>
            <div id="memorize-${ix}" class="col-lg-3 col-md-3 col-sm-3 col-xs-8 fs-14">${obj_list[i][5]}</div>
            <div id="definy-${ix}" class="col-lg-2 col-md-2 col-sm-2 col-xs-4 fs-14">${obj_list[i][4]}</div>
            <div id="cltype-${ix}" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdt-10">
              <span class="fs-12 fc-gr text-right">${obj_list[i].slice(0,4).join("/")}</span>
              <span id="lvcon-${ix}" class="fs-12 fc-gr text-left">&nbsp;(중요도:&nbsp;${obj_list[i][8]}&nbsp;/&nbsp;출처:&nbsp;${obj_list[i][9]})</span>
            </div>
          </div>
        </div>`;
    }
  }
  if (page < all_page) {
    $("#content-wh").html(html_content);
    PageLoad(page, method);
    document.body.querySelector("#srch-wh").scrollIntoView();
  }
  else {
    alert('마지막 페이지입니다.')
  }
}

// 홀뷰(전체 보기) 함수
function WholeView() {
  let view_method_wh = $("#view-method-wh select").val();
  let level_wh = $("#level-wh select").val();
  let rdo_wh = $('input[name=lvwhRdo]:checked').val();
  ftr_objfn = ftr_objsv;
  html_method = view_method_wh;

  // 중요도에 따른 필터링
  if (level_wh != "전체") {
    if (rdo_wh == "include") {
      ftr_objfn = ftr_objfn.filter((item, index, source)=>{
        return (item[8] <= level_wh);
      });
    }
    else {
      ftr_objfn = ftr_objfn.filter((item, index, source)=>{
        return (item[8] == level_wh);
      });
    }
  }
  $("#srch-sg").addClass("hidden");
  $("#content-sg").addClass("hidden");
  $("#srch-wh").removeClass("hidden");
  $("#content-wh").removeClass("hidden");
  $("#page-wh").removeClass("hidden");
  NxtPage(0, view_method_wh);

  // 옵션 숨기기, 옵션 보기 버튼 활성화
  $("#option-menu").addClass("hidden");
  $("#btn-opshow").removeClass("hidden");
  $("#btn-ophide").addClass("hidden");
}
