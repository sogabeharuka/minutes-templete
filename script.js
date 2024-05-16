// フォーマット作成
const createFormat = () => {
  // 最新情報を反映するために、modalが既に存在していたら削除
  const existingModal = document.getElementById('modal-1');
  if (existingModal) {
    existingModal.remove();
  }

  const policyName = document.getElementById('policyName').value;
  const title = document.getElementById('title').value;

  // 担当者・報告者を入れる箱
  let personInCharge = [];
  // 人名全てを取得
  const personCheck = document.querySelectorAll('.personInCharge');

  personCheck.forEach((person) => {
    // チェックされていたら名前取得
    if (person.checked) {
      const personName = document.querySelector(`label[for="${person.id}"]`).textContent;
      personInCharge.push(personName);
    }
  });
  const personString = personInCharge.join('\n- ');
  const status = document.getElementById('status').value;
  const date = document.getElementById('date').value;
  const term = document.getElementById('term').value;
  const report = document.getElementById('report').value;
  const nextAction = document.getElementById('nextAction').value;

  const format = `
### ${policyName}

${
  policyName === 'その他の共有・相談事項' && title
    ? `### ${title}`
    : title
    ? `#### ◼︎ ${title}`
    : ''
}

##### 担当・報告者\n\n- ${personString}

${status ? `##### ステータス\n\n- ${status}` : ''}

${date ? `##### 開催日\n\n- ${date}` : ''}

${term ? `##### 期間\n\n- ${term}まで` : ''}

##### 報告・相談

${report}

${nextAction ? `##### Next Action\n\n${nextAction}` : ''}`;
  // 2行以上の空行を1行に統一
  const replacedFormat = format.replace(/\r?\n{3,}/, '\n\n');

  // モーダルをHTMLに入れる
  const modalHTML = `
                          <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
                            <div class="modal-overlay" tabindex="-1" data-micromodal-close>
                              <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                                  <header class="modal-header">
                                    <h2 class="modal-title" id="modal-1-title">テンプレート</h2>
                                    <button class="modal-close" aria-label="Close modal" data-micromodal-close></button>
                                  </header>
                                  <div class="modal-content" id="modal-1-content">
                                    <pre>${replacedFormat}</pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

// コピー機能
const copy = async () => {
  const targetCode = document.querySelector('pre').textContent;
  try {
    await navigator.clipboard.writeText(targetCode);
    document.getElementById('copyButton').textContent = 'コピーされました';
    document.getElementById('copyButton').style.color = '#fff';
    document.getElementById('copyButton').style.background = '#3498db';
  } catch (error) {
    console.log(error);
  }
};

// モーダルを初期化して表示
const showModal = () => {
  MicroModal.init();
  MicroModal.show('modal-1');
};

// 必須項目が入力されているかチェックする
const check = () => {
  const policyName = document.getElementById('policyName').value;
  let personInCharge = [];
  const personCheck = document.querySelectorAll('.personInCharge');
  personCheck.forEach((person) => {
    if (person.checked) {
      const personName = document.querySelector(`label[for="${person.id}"]`).textContent;
      personInCharge.push(personName);
    }
  });
  const report = document.getElementById('report').value;
  // 必須項目が入力されていなかったらアラート表示
  if (policyName === '選択してください' || !report || personInCharge.length === 0) {
    window.alert('必須項目を入力してください');
    return false;
  }
  return true;
};

// プレビューボタンを押すとモーダル表示
document.getElementById('previewButton').addEventListener('click', async () => {
  const isCheck = await check();
  if (!isCheck) return;
  await createFormat();
  await showModal();
});

// 生成してコピーボタンを押すとコピー
document.getElementById('copyButton').addEventListener('click', async () => {
  const isCheck = await check();
  if (!isCheck) return;
  await createFormat();
  await copy();
});
