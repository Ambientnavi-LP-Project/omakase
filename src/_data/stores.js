/* ============================================================
 * Phase 2 フロント変更（予約フォーム）
 *  - GAS Web App の doGet で空き状況を取得 → 満席枠を選べなくする／残数表示
 *  - 送信時に doPost で上限判定（ハード）。OKのときだけ EmailJS を発火。
 *
 * ★前提: Phase 1 の変更（紹介者 r_referrer / store_slug 送信）が入っていること。
 * ============================================================ */


/* ------------------------------------------------------------
 * 1) Web App のURL（デプロイ後の /exec を貼る）
 *    <script> の冒頭、emailjs.init の近くに置く
 * ------------------------------------------------------------ */
const GAS_ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXX/exec';

// パスから店名スラッグを取得（japan/global/map のチャネル接尾辞は除外）
function getStoreSlugFromPath() {
  var segs = window.location.pathname.split('/').filter(function (s) {
    return s && ['japan', 'global', 'map'].indexOf(s) === -1;
  });
  return segs[1] || '';
}


/* ------------------------------------------------------------
 * 2) 空き状況の取得 → 希望時間セレクトに反映
 *    日付が選ばれたタイミングで呼ぶ
 * ------------------------------------------------------------ */
async function refreshAvailability() {
  var date = document.getElementById('r_date').value;
  var timeSel = document.getElementById('r_time');
  if (!date || !timeSel) return;

  var slug = getStoreSlugFromPath();
  try {
    var res = await fetch(GAS_ENDPOINT + '?store=' + encodeURIComponent(slug) + '&date=' + encodeURIComponent(date));
    var json = await res.json();
    if (!json || !json.ok) return;

    Array.prototype.forEach.call(timeSel.options, function (opt) {
      if (!opt.value) return;                 // 先頭の "-" は無視
      var slot = json.slots[opt.value];
      if (!slot) return;
      if (slot.full) {
        opt.disabled = true;
        opt.textContent = opt.value + '（満席 / Full）';
        if (timeSel.value === opt.value) timeSel.value = '';  // 満席を選択済みなら解除
      } else {
        opt.disabled = false;
        opt.textContent = opt.value + '（残り' + slot.remaining + '組 / ' + slot.remaining + ' left）';
      }
    });
  } catch (err) {
    // 取得失敗時はラベルそのまま。最終判定は送信時の doPost が行う。
    console.warn('availability fetch failed', err);
  }
}


/* ------------------------------------------------------------
 * 3) 日付変更リスナーに refreshAvailability() を追加
 *    既存の「工事休業日チェック」リスナーの末尾に1行足すだけ
 * ------------------------------------------------------------
 *  document.addEventListener('DOMContentLoaded', function() {
 *    var dateInput = document.getElementById('r_date');
 *    if (dateInput) {
 *      dateInput.addEventListener('change', function() {
 *        var selected = this.value;
 *        if (BLOCKED_DATES.indexOf(selected) !== -1) {
 *          alert('... 工事休業 ...');
 *          this.value = '';
 *          return;                  // ← 休業日なら空き取得しない
 *        }
 *        refreshAvailability();     // ★ 追加：空き状況を取得して枠に反映
 *      });
 *    }
 *  });
 */


/* ------------------------------------------------------------
 * 4) confirmAndSubmit() を丸ごと差し替え
 *    送信前に doPost で上限判定。OKなら EmailJS（メールはベストエフォート）。
 *    満席なら送信ブロックして残数を更新。
 * ------------------------------------------------------------ */
async function confirmAndSubmit() {
  var checkDetails = document.getElementById('confirm_check_details').checked;
  var checkPolicy  = document.getElementById('confirm_check_policy').checked;
  var errEl = document.getElementById('confirm_error');

  if (!checkDetails || !checkPolicy) {
    errEl.textContent = '両方にチェックを入れてください / Please check both boxes.';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';

  var btn = document.getElementById('confirm_submit_btn');
  var btnHtml = 'この内容で送信<br/><span style="font-size:9px;opacity:0.75;">CONFIRM &amp; SEND</span>';
  btn.textContent = 'Sending...';
  btn.disabled = true;

  var name     = document.getElementById('r_name').value.trim();
  var email    = document.getElementById('r_email').value.trim();
  var phone    = document.getElementById('r_phone').value.trim();
  var referrer = document.getElementById('r_referrer').value.trim();
  var course   = document.getElementById('r_course').value;
  var guests   = document.getElementById('r_guests').value;
  var time     = document.getElementById('r_time').value;
  var date     = document.getElementById('r_date').value;
  var message  = document.getElementById('r_message').value.trim();

  var source = window.location.pathname;
  var slug = getStoreSlugFromPath();
  var segsRegion = source.split('/').filter(function (s) { return s && ['japan', 'global', 'map'].indexOf(s) === -1; });

  var params = {
    name, email, phone, referrer, course, guests, time, date, message,
    source_path:  source,
    store_slug:   slug,
    store_region: segsRegion[0] || '',
    location: '新宿三丁目店',
    location_key: 'shinjuku',
    address_jp: '東京都新宿区新宿3-7-5 一兆ビル 2F',
    address_en: 'Tokyo, Shinjuku-ku, Shinjuku 3-7-5, Iccho Bldg. 2F'
  };

  // --- ① 上限判定（ハード）。ここで枠を確保し、確定行の書込み＆Slackも実施される ---
  var capRes;
  try {
    var capResp = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // preflight回避
      body: JSON.stringify(params)
    });
    capRes = await capResp.json();
  } catch (err) {
    errEl.textContent = '空き状況の確認に失敗しました。通信環境をご確認のうえ、もう一度お試しください。/ Failed to verify availability. Please try again.';
    errEl.style.display = 'block';
    btn.innerHTML = btnHtml;
    btn.disabled = false;
    return;
  }

  if (!capRes || !capRes.ok) {
    if (capRes && capRes.reason === 'full') {
      errEl.textContent = '申し訳ございません。選択された時間枠は満席です。別の時間をお選びください。/ This time slot is fully booked. Please choose another time.';
    } else if (capRes && capRes.reason === 'busy') {
      errEl.textContent = 'アクセスが集中しています。数秒後にもう一度お試しください。/ Busy now, please retry in a few seconds.';
    } else {
      errEl.textContent = 'エラーが発生しました。再度お試しください。/ An error occurred. Please try again.';
    }
    errEl.style.display = 'block';
    btn.innerHTML = btnHtml;
    btn.disabled = false;
    await refreshAvailability();   // 満席表示を最新化
    return;
  }

  // --- ② 枠確保OK = 予約は確定済み。メールはベストエフォート（失敗しても成功画面） ---
  params.booking_id = capRes.booking_id;
  try {
    await emailjs.send('service_41qov79', 'template_uk1m5wn', params);
    await emailjs.send('service_41qov79', 'template_f9w6hmy', params);
  } catch (mailErr) {
    // 予約自体は確定（シート＆Slack済み）。メール失敗はログのみ。
    console.warn('EmailJS failed but booking is recorded:', mailErr);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'reservation_form_submit',
    form_guests: guests,
    form_date: date,
    form_course: course,
    source_path: source,
    booking_id: capRes.booking_id
  });

  // 成功画面へ
  document.getElementById('confirmDialog').style.display = 'none';
  document.getElementById('reserveForm').style.display = 'none';
  document.getElementById('reserveSuccess').style.display = 'block';
  var brushSvg = document.getElementById('sumiBrushSvg');
  if (brushSvg) {
    brushSvg.classList.remove('drawing');
    void brushSvg.offsetWidth;
    brushSvg.classList.add('drawing');
  }
}
